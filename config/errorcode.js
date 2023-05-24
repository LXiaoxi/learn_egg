module.exports = {
  'USER_NOT_EXIST': {
    status: 400,
    code: '400', // override code value，覆盖code value。
    message: 'can`t find user info',
    errorPageUrl: '', // app will redirect this url when accepts is html 
    addtion1: 'a', // any, will return to browser 附件性的
  },
  'NOT_FOUND': {
    errorPageUrl: (ctx, error) => {
      return '/404.html';
    }
  },
  '404': (ctx, error) => {
    ctx.redirect('/404.html');
    return false; // you can return false, break default logic，打断默认的逻辑
  }
}