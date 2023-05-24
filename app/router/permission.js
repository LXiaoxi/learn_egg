module.exports = (app) => {
  const { router, controller } = app;

  // 菜单
  router.post("/menu/add", controller.permission.menu.addMenu);
  router.put("/menu/update/:menu_id", controller.permission.menu.updateMenu);
  router.delete("/menu/delete/:menu_id", controller.permission.menu.deleteMenu);
  router.get("/menu/list", controller.permission.menu.getMenus);

  // 角色
  router.post("/role/add", controller.permission.role.addRole);
  router.put("/role/update/:role_id", controller.permission.role.updateRole);
  router.delete("/role/delete/:role_id", controller.permission.role.deleteRole);
  router.get("/role/list", controller.permission.role.getRoleList);

  // 菜单角色关系
  router.post("/menu/role/add", controller.permission.menu.addMenuRole);

  // 根据角色返回菜单
  router.get("/role/:role_id/menu", controller.permission.role.getRoleMenu);
};
