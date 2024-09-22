exports.removeProperties = (targetObject, ...properties) => {
  const clonedObject = { ...targetObject };
  for (let property of properties) {
    if (property in clonedObject) {
      delete clonedObject[property];
    }
  }
  return clonedObject;
};

exports.removePassword = (targetObject) => {
  const clonedObject = { ...targetObject };
  if ("password" in clonedObject) {
    delete clonedObject["password"];
  }
  return clonedObject;
};
