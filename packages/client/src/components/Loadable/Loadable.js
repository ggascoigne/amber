import Loader from 'components/Loader/Loader'
import ReactLoadable from 'react-loadable'

const Loadable = opts =>
  ReactLoadable({
    loading: Loader,
    ...opts
  })

export default Loadable
