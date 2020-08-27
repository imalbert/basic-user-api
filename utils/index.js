'use strict';

const uuidv4 = require('uuid').v4
const generateId = () => uuidv4()

module.exports.createId = generateId
module.exports.createToken = generateId