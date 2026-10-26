const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

(async () => {
  const base = 'http://localhost:3010';

  const login = await axios.post(`${base}/api/admin/login`, {
    email: 'pledevelopmentorg@gmail.com',
    password: '334433',
  });

  const token = login.data.token;
  const filePath = path.join(__dirname, 'tmp-upload-check.txt');
  fs.writeFileSync(filePath, 'hello upload check');

  const form = new FormData();
  form.append('name', 'Test Member');
  form.append('country', 'Kenya');
  form.append('city', 'Nairobi');
  form.append('field', 'Education');
  form.append('years', '3');
  form.append('photo', fs.createReadStream(filePath));

  try {
    const res = await axios.post(`${base}/api/team-members`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('STATUS', res.status);
    console.log(JSON.stringify(res.data));
  } catch (error) {
    console.log('ERROR_STATUS', error.response && error.response.status);
    console.log('ERROR_DATA', JSON.stringify(error.response && error.response.data));
    process.exitCode = 1;
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
})();
