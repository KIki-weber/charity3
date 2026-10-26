const tableMigrations = [
  {
    table: "team_members",
    targets: {
      photo: (row) => {
        const values = [
          ...readMediaValues(row.photo),
          ...readMediaValues(row.photos),
          ...readMediaValues(row.image),
        ];
        const image = values.find((value) => isMediaType(value, "image"));
        return image || values[0] || null;
      },
    },
    legacyColumns: ["photos", "video", "file", "image"],
  },
  {
    table: "programs",
    targets: {
      photos: (row) => uniqueMediaValues([
        ...readMediaValues(row.photo),
        ...readMediaValues(row.photos),
        ...readMediaValues(row.image),
      ]),
      video: (row) => readMediaValues(row.video)[0] || null,
      file: (row) => readMediaValues(row.file)[0] || null,
    },
    legacyColumns: ["photo", "image"],
  },
  {
    table: "projects",
    targets: {
      photos: (row) => uniqueMediaValues([
        ...readMediaValues(row.photo),
        ...readMediaValues(row.photos),
        ...readMediaValues(row.image),
        ...readMediaValues(row.featuredImage),
        ...readMediaValues(row.featured_image),
      ]),
      video: (row) => readMediaValues(row.video)[0] || null,
      file: (row) => readMediaValues(row.file)[0] || readMediaValues(row.featured_file)[0] || null,
    },
    legacyColumns: ["photo", "image", "featuredImage", "featured_image", "featured_file"],
  },
  {
    table: "impacts",
    targets: {
      media: (row) => {
        const values = uniqueMediaValues([
          ...readMediaValues(row.media),
          ...readMediaValues(row.photo),
          ...readMediaValues(row.photos),
          ...readMediaValues(row.image),
          ...readMediaValues(row.photosVideo),
          ...readMediaValues(row.video),
          ...readMediaValues(row.file),
        ]);
        return values.find((value) => isMediaType(value, "image") || isMediaType(value, "video"))
          || values[0]
          || null;
      },
    },
    legacyColumns: ["photo", "photos", "video", "file", "image", "photosVideo"],
  },
  {
    table: "organization_certificates",
    targets: {
      photos: (row) => uniqueMediaValues([
        ...readMediaValues(row.photo),
        ...readMediaValues(row.photos),
        ...readMediaValues(row.image),
      ]),
      files: (row) => uniqueMediaValues([
        ...readMediaValues(row.files),
        ...readMediaValues(row.file),
        ...readMediaValues(row.video),
        ...readMediaValues(row.certificatePdf),
      ]),
    },
    legacyColumns: ["photo", "video", "file", "image", "certificatePdf"],
  },
  {
    table: "digital_member_ids",
    targets: {
      photo: (row) => readMediaValues(row.photo)[0] || null,
      photos: (row) => uniqueMediaValues(readMediaValues(row.photos)),
      video: (row) => readMediaValues(row.video)[0] || null,
      file: (row) => readMediaValues(row.file)[0] || null,
    },
    legacyColumns: [],
  },
];

const readMediaValues = (value) => {
  if (value === null || value === undefined || value === "") {
    return [];
  }

  let parsedValue = value;
  if (typeof parsedValue === "string") {
    const trimmedValue = parsedValue.trim();
    if (!trimmedValue) {
      return [];
    }

    try {
      parsedValue = JSON.parse(trimmedValue);
    } catch {
      return [trimmedValue];
    }
  }

  if (Array.isArray(parsedValue)) {
    return parsedValue.flatMap(readMediaValues);
  }

  if (parsedValue && typeof parsedValue === "object") {
    const source = parsedValue.url || parsedValue.path || parsedValue.src || parsedValue.filename;
    return source ? readMediaValues(source) : [];
  }

  return typeof parsedValue === "string" && parsedValue ? [parsedValue] : [];
};

const uniqueMediaValues = (values) => [...new Set(values)];

const isMediaType = (value, type) => {
  const normalizedValue = String(value).toLowerCase();
  if (type === "image") {
    return /\.(jpe?g|jfif|pjpeg|pjp|png|gif|webp|bmp|svg|avif)(?:[?#].*)?$/.test(normalizedValue);
  }

  if (type === "video") {
    return /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(?:[?#].*)?$/.test(normalizedValue);
  }

  return /\.(mp4|webm|ogg|mov|m4v|avi|mkv|pdf|docx?|xlsx?|pptx?|txt|csv|rtf)(?:[?#].*)?$/.test(normalizedValue);
};

const getJsonValue = (value) => (value === null ? null : JSON.stringify(value));

export const migrateMediaSchema = async (sequelize) => {
  const queryInterface = sequelize.getQueryInterface();

  for (const migration of tableMigrations) {
    let columns;
    try {
      columns = await queryInterface.describeTable(migration.table);
    } catch (error) {
      if (error.original?.code === "ER_NO_SUCH_TABLE" || error.original?.code === "42S02") {
        continue;
      }
      throw error;
    }
    if (!columns || !columns.id) {
      continue;
    }

    const existingTargets = Object.keys(migration.targets)
      .filter((column) => columns[column]);
    const existingLegacy = migration.legacyColumns
      .filter((column) => columns[column]);
    const missingTargets = Object.keys(migration.targets)
      .filter((column) => !columns[column]);

    for (const column of missingTargets) {
      await queryInterface.addColumn(migration.table, column, {
        type: "JSON",
        allowNull: true,
      });
    }

    const sourceColumns = [...new Set([...existingTargets, ...existingLegacy])];
    if (sourceColumns.length > 0) {
      const selectedColumns = ["id", ...sourceColumns]
        .map((column) => `\`${column}\``)
        .join(", ");
      const [rows] = await sequelize.query(
        `SELECT ${selectedColumns} FROM \`${migration.table}\`;`
      );

      for (const row of rows) {
        const values = Object.entries(migration.targets)
          .map(([column, getValue]) => [column, getValue(row)]);

        for (const [column, value] of values) {
          const assignment = value === null
            ? `\`${column}\` = NULL`
            : `\`${column}\` = CAST(:jsonValue AS JSON)`;
          await sequelize.query(
            `UPDATE \`${migration.table}\` SET ${assignment} WHERE \`id\` = :id;`,
            {
              replacements: {
                id: row.id,
                ...(value === null ? {} : { jsonValue: getJsonValue(value) }),
              },
            }
          );
        }
      }
    }

    for (const column of missingTargets) {
      await queryInterface.changeColumn(migration.table, column, {
        type: "JSON",
        allowNull: true,
      });
    }

    for (const column of existingLegacy) {
      if (!Object.hasOwn(migration.targets, column)) {
        await queryInterface.removeColumn(migration.table, column);
      }
    }

    for (const column of existingTargets) {
      const columnType = String(columns[column].type || "").toUpperCase();
      if (!columnType.startsWith("JSON")) {
        await queryInterface.changeColumn(migration.table, column, {
          type: "JSON",
          allowNull: true,
        });
      }
    }
  }
};
