import { OrganizationCertificate } from "../models/index.js";

export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await OrganizationCertificate.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(certificates);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch certificates", error: error.message });
  }
};

export const getCertificateById = async (req, res) => {
  try {
    const certificate = await OrganizationCertificate.findByPk(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch certificate", error: error.message });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const certificate = await OrganizationCertificate.create(req.body);
    return res.status(201).json(certificate);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create certificate", error: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const certificate = await OrganizationCertificate.findByPk(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    await certificate.update(req.body);
    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update certificate", error: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await OrganizationCertificate.findByPk(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    await certificate.destroy();
    return res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete certificate", error: error.message });
  }
};
