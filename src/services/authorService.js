import authService from "./authService";

const checkPermission = (role) => {
  const user = authService.getCurrentUser();
  return user.title == role ? true : false;
};

const authorService = {
  checkPermission,
};

export default authorService;
