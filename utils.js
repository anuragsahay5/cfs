export const getUserInfo = async (user_handle) => {
  try {
    const response = await fetch(
      "https://codeforces.com/api/user.status?handle=" + user_handle
    );
    console.log(response);
  } catch (error) {}
};
