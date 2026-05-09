/**
 * Mengganti URL S3 bawaan dengan URL CDN ImageKit untuk optimasi gambar.
 * 
 * @param {string} s3Url - URL gambar asli dari AWS S3
 * @returns {string} - URL CDN ImageKit
 */
export const getCdnUrl = (s3Url) => {
  if (!s3Url) return '';
  // Pastikan domain S3 ini sesuai dengan bucket yang di-set di .env Anda
  const s3Domain = 'https://feeder-storage-cleosa.s3.ap-southeast-2.amazonaws.com';
  const cdnDomain = 'https://ik.imagekit.io/a4jqgz5zw';
  
  return s3Url.replace(s3Domain, cdnDomain);
};
