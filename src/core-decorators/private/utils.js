export function isDescriptor(desc) {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }
  
  const keys = ['value', 'get', 'set'];
  
  for (const key of keys) {
    if (desc.hasOwnProperty(key)) {
      return true;
    }
  }
  
  return false;
}

export function decorate(handleDescriptor, entryArgs) {
  if (isDescriptor(entryArgs[entryArgs.length - 1])) {
    return handleDescriptor(...entryArgs, []);
  } else {
    return function () {
      return handleDescriptor(...arguments, entryArgs);
    };
  }
}
