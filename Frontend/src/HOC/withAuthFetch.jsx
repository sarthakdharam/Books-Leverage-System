import authFetch from "../utils/authFetch";

function withAuthFetch(Component){
    return function(props){
        return <Component {...props} authFetch={authFetch} />
    }
}

export default withAuthFetch 
