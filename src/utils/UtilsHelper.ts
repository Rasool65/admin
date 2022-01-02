export class UtilsHelper {
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
      // value += '';

      return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      // return value.toLocaleString('en')
    } catch (e) {
      return '';
    }
  };
}
