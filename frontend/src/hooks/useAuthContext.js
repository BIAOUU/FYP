import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';

export const useAuthContext = () => {
    // context will have the state & dispatch function from the workoutContext
    const context = useContext(AuthContext);

    if (!context) {
        throw Error('useAuthContext must bed used inside an WorkoutsContextProvider')
    }

    return context
}