// backend/routes/auth.js
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash: hash, role });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, name, email, role } });
});

router.post('/login', async (req, res) => { /* similar */ });
