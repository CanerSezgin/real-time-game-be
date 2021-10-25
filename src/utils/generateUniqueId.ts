// This is the simplest implementation of genarating unique id. It can be changed with better solutions like UUID library.
export default (prefix = '') => prefix + new Date().getTime().toString()
