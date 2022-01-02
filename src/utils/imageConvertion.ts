export class ImageHelper {
  public static getBase64 = (imageFile: Blob) => {
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      reader.onload = (e: any) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
    });

    reader.readAsDataURL(imageFile);
    return promise;
  };
}
