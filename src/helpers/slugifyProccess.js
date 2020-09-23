import slugify from 'slugify';

/**
 * 
 * @param {String to Slogify} str 
 */

const slugifyProccess = (str) => {
  return slugify(str, {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    lower: true,      // convert to lower case, defaults to `false`
    strict: true,    // strip special characters except replacement, defaults to `false`
    locale: 'es'
  }); 
}

export default slugifyProccess;