const { defineProperty, getOwnPropertyDescriptor } = Object;

export default
function applyDecorators(Class, props) {
  const { prototype } = Class;
  
  for (const key in props) {
    const decorators = props[key];

    for (let i = 0, l = decorators.length; i < l; i++) {
      const decorator = decorators[i];

      defineProperty(prototype, key,
        decorator(
          prototype,
          key, 
          getOwnPropertyDescriptor(prototype, key)
        )
      ); 
    }
  }
  
  return Class;
}
