/**
 * Single place to change the details that vary per deployment.
 */
export const siteConfig = {
  email: 'rootbyte.services@gmail.com',

  /**
   * POST endpoint for the contact form: e.g. a Formspree / Basin / Web3Forms
   * URL, or your own API route. Leave empty and the form falls back to opening
   * the visitor's mail client with everything pre-filled, so an inquiry is
   * never silently dropped.
   */
  formEndpoint: '',

  social: {
    github: 'https://github.com/rootByte-services',
    instagram: 'https://www.instagram.com/rootbyteservices',
    linkedin: 'https://www.linkedin.com/company/rootbyte-services'
  }
};
