import { useAuthContext } from "./useAuthContext"


export const useLogout = () => {
    
    const { dispatch } = useAuthContext()

    // update the token and update the global state no need to update backend
    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch LOGOUT function no payload
        // setting state user properties to null only
        dispatch({type:'LOGOUT'})
        // clear workout state when user logout or else when some other
        // user log in they will see a flash of the previous user workout
    }

    return {logout};
    
}