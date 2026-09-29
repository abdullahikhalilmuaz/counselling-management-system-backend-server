const Settings = require('../models/Settings');

async function getOrCreate() {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
}

exports.get = async (_req, res, next) => {
  try { res.json(await getOrCreate()); } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const s = await getOrCreate();
    Object.assign(s, req.body);
    await s.save();
    res.json(s);
  } catch (err) { next(err); }
};
