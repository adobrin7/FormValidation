# Form validation

This is the concept of clean organizing form validation patterns.

The main idea is:

All needed validations patterns stored in separate object...

```javascript
const validationMethods = {
  onlyNumbers(field) {
    for (const value of field.value) {
      if (!Number.isInteger(Number(value))) {
        return 'Поле должно содержать только цифры.';
      }
    }
    return null;
  },

  sameFields(field, args) {
    return field.value !== document.querySelector(args[0]).value ? 'Поля не совпадают.' : null;
  }
}
```

...and organized in form object...

```javascript
this.rules = [
  {
    selector: 'input[name="name"]',
    methods: [
      { name: 'length', args: ['>=', 1] },
      { name: 'length', args: ['<=', 50] },
    ],
  },
  {
    selector: 'input[name="phone"]',
    methods: [
      { name: 'onlyNumbers' },
      { name: 'length', args: ['==', 11] },
    ],
  },
]
```

...that calls validation methods based on rules' template.

```javascript
function validate() {
  let isValid = true;
  for (const rule of this.rules) {
    const inputField = document.querySelector(rule.selector);

    for (let method of rule.methods) {
      const validationTest = this.validationMethods[method.name];
      const errMessage = validationTest(inputField, method.args);

      if (errMessage) {
        isValid = false;
      }
    }
  }
  return isValid;
}
```
