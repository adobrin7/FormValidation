const validationMethods = {
  length(field, args) {
    const valueLength = field.value.length;
    const sign = args[0];
    const requiredLength = args[1];

    let message = null;
    switch (sign) {
      case '>':
        if (!(valueLength > requiredLength)) {
          message = `Минимальная длина поля: ${requiredLength + 1}.`;
        }
        break;
      case '<':
        if (!(valueLength < requiredLength)) {
          message = `Максимальная длина поля: ${requiredLength - 1}.`;
        }
        break;
      case '>=':
        if (!(valueLength >= requiredLength)) {
          message = `Минимальная длина поля: ${requiredLength}.`;
        }
        break;
      case '<=':
        if (!(valueLength <= requiredLength)) {
          message = `Максимальная длина поля: ${requiredLength}.`;
        }
        break;
      case '==':
        if (valueLength !== requiredLength) {
          message = `Необходимая длина поля: ${requiredLength}.`;
        }
        break;
    }
    return message;
  },

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

const form = {
  src: null,
  rules: null,
  validationMethods,

  init() {
    this.src = document.querySelector('.my-form');
    this.src.addEventListener('submit', event => this.submit(event));

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
      {
        selector: 'input[name="password"]',
        methods: [
          { name: 'length', args: ['>=', 5] },
          { name: 'length', args: ['<=', 50] },
        ],
      },
      {
        selector: 'input[name="password_repeat"]',
        methods: [
          { name: 'sameFields', args: ['input[name="password"]'] },
        ],
      },
    ];
  },

  submit(event) {
    const isValid = this.validate();
    if (!isValid) {
      event.preventDefault();
    }
  },

  validate() {
    let isValid = true;
    for (const rule of this.rules) {
      const inputField = document.querySelector(rule.selector);

      for (let method of rule.methods) {
        const validationTest = this.validationMethods[method.name];
        const errMessage = validationTest(inputField, method.args);

        if (errMessage) {
          this.setInvalidField(inputField, errMessage);
          isValid = false;
          break;
        } else {
          this.setValidField(inputField);
        }
      }
    }
    return isValid;
  },

  setValidField(field) {
    const cl = field.classList;
    cl.remove('is-invalid');
    cl.add('is-valid');
  },

  setInvalidField(field, message) {
    const cl = field.classList;
    cl.remove('is-valid');
    cl.add('is-invalid');

    let hintWrap = field.parentNode.querySelector('.invalid-feedback');
    if (!hintWrap) {
      hintWrap = document.createElement('div');
      hintWrap.classList.add('invalid-feedback');
      field.parentNode.appendChild(hintWrap);
    }
    hintWrap.textContent = message;
  },
}

form.init();