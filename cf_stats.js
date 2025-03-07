// Methods

const getUserInfo = async (user_handle) => {
  try {
    const response = await (
      await fetch(
        "https://codeforces.com/api/user.status?handle=" + user_handle
      )
    ).json();
    return response.result;
  } catch (error) {
    throw error;
  }
};

const getFilteredData = (response) => {
  try {
    let solved_rating_wise = {};
    let solved_tag_wise = {};
    let solved_level_wise = {};

    let problem_set = new Set();
    let temp_variable;

    response.forEach((val) => {
      temp_variable = val.problem.contestId + val.problem.index; // unique id of the problem
      if (
        val.verdict == "OK" && // accepted solution
        !problem_set.has(temp_variable) && // only choose unique problems
        val.problem.rating // must be rated
      ) {
        problem_set.add(temp_variable);

        // problem rating wise
        temp_variable = val.problem.rating;
        solved_rating_wise[temp_variable]
          ? solved_rating_wise[temp_variable]++
          : (solved_rating_wise[temp_variable] = 1);

        // problem level wise
        temp_variable = val.problem.index[0];
        solved_level_wise[temp_variable]
          ? solved_level_wise[temp_variable]++
          : (solved_level_wise[temp_variable] = 1);

        // problem tag wise
        temp_variable = val.problem.tags;
        temp_variable.forEach((tag) => {
          solved_tag_wise[tag]
            ? solved_tag_wise[tag]++
            : (solved_tag_wise[tag] = 1);
        });
      }
    });

    return { solved_rating_wise, solved_level_wise, solved_tag_wise };
  } catch (error) {
    throw error;
  }
};

const finalSortedData = (filteredData) => {
  try {
    const solved_level_wise = Object.fromEntries(
      Object.entries(filteredData.solved_level_wise).sort(([a], [b]) =>
        a.localeCompare(b)
      )
    );

    const solved_rating_wise = Object.fromEntries(
      Object.entries(filteredData.solved_rating_wise).sort(([a], [b]) =>
        a.localeCompare(b)
      )
    );

    const solved_tag_wise = Object.fromEntries(
      Object.entries(filteredData.solved_tag_wise).sort(([, a], [, b]) => b - a)
    );

    return { solved_rating_wise, solved_level_wise, solved_tag_wise };
  } catch (error) {
    throw error;
  }
};

const finalFunction = async (user_handle) => {
  try {
    const sortedData = finalSortedData(
      getFilteredData(await getUserInfo(user_handle))
    );
    console.log(sortedData);
  } catch (error) {
    window.alert(error.message);
  }
};

// use case

const injectElement = () => {
  const node = document.createElement("div");
  node.textContent = "Mazza a gya re baba";
  node.id = "cf_stats_container_0xv1jrs";
  finalFunction($user_handle);
  const pageContent = document.getElementById("pageContent");
  pageContent.appendChild(node);
};

window.addEventListener("load", () => {
  injectElement();
});
