const { Test } = require("../models/test");
const axios = require('axios');
const util = require('util');
const QRCode = require('qrcode')

qrCode = util.promisify(QRCode.toDataURL)

const obtainTests = async (req, res) => {
  const tests = await Test.find({ isDelete: false }).sort({ createdAt: -1 });
  res.send(tests);
}

const obtainTest = async (req, res) => {
  const id = req.params.id;

  const testDB = await Test.findOne({ _id: id, isDelete: false });

  if (!testDB) {
    return res.status(404).send({
      err: 'El test no existe'
    })
  }

  res.send({ test: testDB });
}

const createTest = async (req, res) => {
  const test = new Test(req.body);

  if (req.body.result !== undefined) {
    const code = await qrCode(`${process.env.CLIENT_URL}/resultado-${test._id}/`);

    test.qrcode = code;

    ////Build Gatsby
    await axios.post(process.env.BUILD_WEBHOOK);
  }

  await test.save();

  res.send({ test });
}

const updateTest = async (req, res) => {
  const id = req.params.id;

  const testDB = await Test.findOne({ _id: id, isDelete: false });

  if (!testDB) {
    return res.status(404).send({
      err: 'El test no existe'
    })
  }

  delete req.body.isDelete;

  if (testDB.result === null && req.body.result !== undefined) {
    const code = await qrCode(`${process.env.CLIENT_URL}/resultado-${testDB._id}/`);

    testDB.set({
      qrcode: code
    })
  }

  testDB.set(req.body);

  await testDB.save();

  ////Build Gatsby
  await axios.post(process.env.BUILD_WEBHOOK);

  res.send({ test: testDB });
}

const deleteTest = async (req, res) => {
  const id = req.params.id;

  const testDB = await Test.findOne({ _id: id, isDelete: false });

  if (!testDB) {
    return res.status(404).send({
      err: 'El test no existe'
    })
  }

  testDB.set({ isDelete: true, isValid: false });

  await testDB.save();

  //Build Gatsby
  await axios.post(process.env.BUILD_WEBHOOK);

  res.send({ msg: 'Test eliminado correctamente' });
}

module.exports = {
  obtainTests,
  obtainTest,
  createTest,
  updateTest,
  deleteTest
}