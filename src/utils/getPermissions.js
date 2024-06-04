export const getPermissions = (location, MenuPermissionList) => {
    // console.log(location);
    // console.log(MenuPermissionList);

    let path = location.pathname;
    let listPermissions = MenuPermissionList;
    let thePermissions  = {};

    listPermissions.find(item => {
        if(item.sModule.length > 0){
            thePermissions = item.sModule.find(submodule => path.includes(submodule.route));
        }
        
        return thePermissions;
    });
    thePermissions = thePermissions.actions;

    let formattedPermissions = {};
    if(thePermissions.length > 0){
        for (let i = 0; i < thePermissions.length; i++) {
            const per = thePermissions[i];

            formattedPermissions[per.permission.operation.name.toLowerCase()] = true;
        }
    }

    // console.log("Permissions:", formattedPermissions);

    return formattedPermissions;
}