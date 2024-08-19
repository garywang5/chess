import { useAppContext }from '../../../Context'
import { takeBack } from '../../../reducer/action/move';

const TakeBack = () => {
    const {dispatch} = useAppContext();

    return <div>
        <button onClick={() => dispatch(takeBack())}>Take Back</button>
    </div>
}

export default TakeBack