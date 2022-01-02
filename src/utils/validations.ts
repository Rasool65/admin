export class Validation {
  // isNationalCode
  public static isNationalCode = (value: any): boolean => {
    let sum = 0;
    let r = 0;
    let checkDigit = 0;
    let nationalCodeStr = value.toString();
    if (
      (nationalCodeStr &&
        nationalCodeStr.length === 10 &&
        nationalCodeStr
          .split('')
          .every((char: any) => char === nationalCodeStr[0])) ||
      nationalCodeStr.length > 10
    ) {
      return false;
    }
    if (nationalCodeStr.length <= 8 || nationalCodeStr * 1 <= 0x98968a) {
      return false;
    }
    nationalCodeStr = ['00', nationalCodeStr.trim()].join('');
    nationalCodeStr = nationalCodeStr.substring(
      nationalCodeStr.length - 10,
      nationalCodeStr.length
    );
    checkDigit = nationalCodeStr.substring(9, 10) * 1;
    nationalCodeStr = nationalCodeStr.split('');
    for (let i = 0; i < 9; i += 1) {
      sum += nationalCodeStr[i] * (10 - i);
    }
    r = sum % 11;
    if ((r > 1 ? 11 - r : r) === checkDigit) {
      return true;
    } else {
      return false;
    }
  };

  // isMobileNumber
  public static isMobileNumber = (value: any): boolean => {
    if (value && value.length > 0 && value.match(/((9|9|9)[0-9]{9})/gi)) {
      const v = value.match(/((9|9|9)[0-9]{9})/gi);

      return (
        !!v &&
        v !== undefined &&
        v.length > 0 &&
        v[0].length === 10 &&
        (v[0] === value || ['0', v[0]].join('') === value)
      );
    }
    return false;
  };

  // isTel
  public static isTel = (value: any): boolean => {
    if (
      (value && value.length > 0 && (value + '').slice(0, 2) !== '09') ||
      (value + '').slice(0, 2) === '00' ||
      value.length < 11
    ) {
      return false;
    }
    return true;
  };

  // isPhoneNumber
  public static isPhoneNumber = (value: any) => {
    const num = value.replace(/\s/g, '');
    if (num) {
      if (num.length === 10) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  public static isNumber = (value: any): boolean => {
    const num = /^\d*$/.test(value);
    if (num) {
      return true;
    } else {
      return false;
    }
  };

  public static base64DecodeUnicode = (token: string | null) => {
    if (token) {
      const splitToken: string[] = token.split('.');
      return JSON.parse(window.atob(splitToken[1]));
    }
  };

  public static threeDigitSeparator = (value: any) => {
    try {
      if (!value) {
        return '';
      }

      const isValueTypeSuitable =
        typeof value === 'number' || typeof value === 'string';
      if (!isValueTypeSuitable) {
        return '';
      }

      // Convert the `value` to string
      value += '';

      return value.replace(/(\d{3})(?=\d)/g, '$1,');
      // return value.toLocaleString('en')
    } catch (e) {
      return '';
    }
  };

  public static isPersianDate = (value: string): [string, boolean] => {
    const num = /^[0-9]{4}[\/]{1}[0-9]{2}[\/]{1}[0-9]{2}$/g.test(value);

    if (num) {
      return ['', true];
    } else {
      return ['تاریخ را وارد کنید', false];
    }
  };

  public static emptyObjecy = (value: object): boolean => {
    return Object.keys(value).length > 0;
  };
  public static isDigit(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const reg = /^\d+$/;
    const isDigit = input.match(reg);
    if (isDigit) return true;
    else return false;
  }

  public static isValidNumberAndAlphabet(input): [string, boolean] {
    if (typeof input !== 'string') input = input.toString();
    const reg = /^[a-zA-Z0-9]+$/;
    const isValid = input.match(reg);
    if (isValid) return ['', true];
    else return ['نام کاربری شامل عدد و کاراکتر باشد', false];
  }

  public static isCharacter(input): [string, boolean] {
    if (typeof input !== 'string') input = input.toString();

    const reg = /^[a-zA-Z]+$/;
    const isCharacter = input.match(reg);
    if (isCharacter) return ['', true];
    else return ['لطفا حروف وارد کنید', false];
  }

  public static isNumberAndCharacter(input): [string, boolean] {
    if (typeof input !== 'string') input = input.toString();

    const reg = /^[0-9_.-]*$/;
    const isNumberAndCharacter = input.match(reg);
    if (isNumberAndCharacter) return ['', true];
    else return ['نام کاربری میبایست شامل عدد و کاراکتر باشد', false];
  }

  public static isPhoneStyle(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const reg = /^[0-9 +,-]+$/;
    const isNumberAndCharacter = input.match(reg);
    if (isNumberAndCharacter) return true;
    else return false;
  }
  public static mobileStyle(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const reg = /^[0-9 +]+$/;
    const isNumberAndCharacter = input.match(reg);
    if (isNumberAndCharacter) {
      return true;
    } else {
      return false;
    }
  }
  public static isUrl(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const reg =
      /^((http|https):\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    const isUrl = input.match(reg);
    if (isUrl) return true;
    else return false;
  }

  public static isEmail(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const reg =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const isEmail = input.match(reg);
    if (isEmail) return true;
    else return false;
  }

  public static isHexWithCustomLength(input, minLength, maxLenth): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = `^[0-9A-Fa-f]{${minLength},${maxLenth}}$`;
    const reg = new RegExp(exp);
    // const reg = /^[0-9A-Fa-f]{8,200}$/;
    const isHex = input.match(reg);

    if (isHex) {
      return true;
    } else {
      return false;
    }
  }
  public static islength(value, minLenfth): boolean {
    if (value.length > minLenfth) {
      return true;
    } else {
      return false;
    }
  }

  public static isAppletVersionStyle(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = `^[A-Za-z0-9.-]*$`;
    const reg = new RegExp(exp, 'g');
    const isVersion = input.match(reg);
    if (isVersion) return true;
    else return false;
  }

  public static isDigitWithRange(input, minLength, maxLenth): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = `^[0-9]{${minLength},${maxLenth}}$`;
    const reg = new RegExp(exp);
    // const reg = /^\d+$/;
    const isDigit = input.match(reg);
    if (isDigit) return true;
    else return false;
  }

  public static isAllCharacter(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = /^[A-Za-z0-9!@#$%^&*()/[_+{}/\]|:"<>?';/.,]*$/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (isAccepted) return true;
    else return false;
  }

  public static isValidSettingKey(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = /[`!@#$%^*&()-]/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (!isAccepted) return true;
    else return false;
  }

  public static isIranMobileNumber(input): [string, boolean] {
    if (typeof input !== 'string') input = input.toString();

    if (!this.isDigit(input)) {
      return ['شماره موبایل میبایست عدد و ۱۱ رقم باشد', false];
    }
    const exp =
      /(0)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (!isAccepted) {
      return ['', true];
    } else {
      return ['شماره موبایل میبایست عدد و ۱۱ رقم باشد', false];
    }
  }
  public static mobileStyle2(input): boolean {
    const exp = /^\+?\d{11,15}$/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    const isValue =
      (input && input.length > 0 && (input + '').slice(0, 2) !== '09') ||
      (input + '').slice(0, 2) === '00';
    if (isAccepted && isValue) {
      return true;
    } else {
      return false;
    }
  }
  public static checkPasswordComplexity(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp =
      /^(?=.*[A-Z])(?=.*[!@%#$&*()-/.`:\\<=>\]?;/[^_{}|~"])(?=.*[0-9])(?=.*[a-z]).{8,64}$/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (isAccepted) return true;
    else {
      return false;
    }
  }

  public static isAlphabetOrNumber(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = /^[0-9A-Za-z]$/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (!isAccepted) return true;
    else return false;
  }

  public static isJalaliDateFormat(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp =
      /^[1-4]\d{3}\/((0[1-6]\/((3[0-1])|([1-2][0-9])|(0[1-9])))|((1[0-2]|(0[7-9]))\/(30|([1-2][0-9])|(0[1-9]))))$/;
    const reg = new RegExp(exp);
    const isAcceptableDate = input.match(reg);
    if (!isAcceptableDate) return true;
    else return false;
  }

  public static isvalidToDefineFields(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = /^[A-Za-z0-9_]*$/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (isAccepted) return true;
    else return false;
  }

  public static isJustPersianCharacters(input): [string, boolean] {
    if (typeof input !== 'string') input = input.toString();

    const exp =
      /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u0020\u2000-\u200F\u2028-\u202F\u06A9\u06AF\u06BE\u06CC\u0629\u0643\u0649-\u064B\u064D\u06D5\s]+$/g;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (isAccepted) return ['', true];
    else return ['لطفا فارسی تایب کنید', false];
  }

  public static isKeyPartitionStyle(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = /^[A-Za-z0-9-_,.|]*$/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (isAccepted) return true;
    else return false;
  }

  public static NameStyle_One(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = /^[\u0600-\u06FF\s]*$/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (isAccepted) return true;
    else return false;
  }

  public static NameStyle_Two(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = /^[\u0600-\u06FF\sA-Za-z0-9 !"'%&:;^`~@#()|$-_=+.,{}]*$/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (isAccepted) return true;
    else return false;
  }
  // @#()-_=+.,{}
  public static NameStyle_Three(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    const exp = /^[A-Za-z0-9@#()-_=+.,{}]*$/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (isAccepted) return true;
    else return false;
  }

  public static NameStyle_Four(input): boolean {
    if (typeof input !== 'string') input = input.toString();

    if (/^[0-9]/.test(input)) return false;

    const exp = /^[A-Za-z0-9_]*$/;
    const reg = new RegExp(exp);
    const isAccepted = input.match(reg);
    if (isAccepted) return true;
    else return false;
  }
  public static ValidationEnglishType(text: any) {
    const texts = text.currentTarget.value;
    const english = /^[A-Za-z0-9]*$/;
    const result = english.test(texts);
    return result;
  }
  public static ValidationSiteAddress(address: any) {
    const addressSite = address.currentTarget.value;
    const pattern =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (pattern.test(addressSite)) {
      return true;
    } else {
      return false;
    }
  }

  public static isIp = (ipValue: string) => {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipValue
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  public static isTimePattern = (timeValue: string) => {
    if (/\d\d:\d\d/.test(timeValue)) {
      return true;
    } else {
      return false;
    }
  };

  public static fixFarsiForSearch = (s: string = '') => {
    const replaces = [
      [/ي/g, 'ی'],
      [/ك/g, 'ک'],
      [/۰/g, '0'],
      [/۱/g, '1'],
      [/۲/g, '2'],
      [/۳/g, '3'],
      [/۴/g, '4'],
      [/۵/g, '5'],
      [/۶/g, '6'],
      [/۷/g, '7'],
      [/۸/g, '8'],
      [/۹/g, '9'],
    ];
    //  YEKE
    return replaces.reduce(
      (_elm, [from, to]) => _elm.replace(from, to.toString()),
      s
    );
  };
}
