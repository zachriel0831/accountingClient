
export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})

export const VisibilityFilters = {
  SHOW_LOGIN_PAGE: 'SHOW_LOGIN_PAGE',
  SHOW_HOME_PAGE: 'SHOW_HOME_PAGE',
  SHOW_HOME_ACCOUNTPAGE: 'SHOW_HOME_ACCOUNTPAGE'
}
