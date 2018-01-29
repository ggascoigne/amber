import React from 'react'

// convert a SFC (Stateless Functional Component) into a PureComponent.
export default function pure (func, shouldCalculateUpdate = true) {
  if (shouldCalculateUpdate) {
    // use the default shouldComponentUpdate in PureComponent
    // this does a shallow compare on props and state
    class PureComponentWrap extends React.PureComponent {
      render () {
        return func(this.props, this.context)
      }
    }

    return PureComponentWrap
  } else {
    // simply return false for shouldUpdateComponent
    // faster when you know what there are no relevant props or state.
    class ComponentWrap extends React.Component {
      shouldComponentUpdate () {
        return false
      }

      render () {
        return func(this.props, this.context)
      }
    }

    return ComponentWrap
  }
}
