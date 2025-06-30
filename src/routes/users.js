const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require(process.env.FIREBASE_SA_PATH)),
});

router.get('/', async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    const users = listUsersResult.users.map(u => ({
      id: u.uid,
      email: u.email,
      displayName: u.displayName || '',
    }));
    res.json(users);
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ error: 'Error listando usuarios' });
  }
});

router.post('/', async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    res.status(201).json({
      id: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: error.message || 'Error creando usuario' });
  }
});

router.delete('/:id', async (req, res) => {
  const uid = req.params.id;
  try {
    await admin.auth().deleteUser(uid);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
});

router.put('/:uid/displayName', async (req, res) => {
  const { uid } = req.params;
  const { displayName } = req.body;

  if (!displayName || typeof displayName !== 'string') {
    return res.status(400).json({ error: 'displayName es requerido y debe ser string' });
  }

  try {
    await admin.auth().updateUser(uid, { displayName });
    return res.status(200).json({ message: 'Nombre actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando displayName:', error);
    return res.status(500).json({ error: 'Error al actualizar el nombre' });
  }
});

router.put('/:uid/password', async (req, res) => {
  const { uid } = req.params;
  const { password } = req.body;

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Contraseña inválida. Debe tener al menos 6 caracteres.' });
  }

  try {
    await admin.auth().updateUser(uid, { password });
    return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error actualizando contraseña:', error);
    return res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
});

module.exports = router;
