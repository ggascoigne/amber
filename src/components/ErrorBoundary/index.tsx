// from https://raw.githubusercontent.com/piotrwitek/react-redux-typescript-guide/master/playground/src/hoc/with-error-boundary.tsx
import React, { ErrorInfo } from 'react'
import type { Subtract } from 'utility-types'

import { ErrorMessage } from './ErrorMessage'

const MISSING_ERROR = 'Error was swallowed during propagation.'

// These props will be subtracted from base component props
interface InjectedProps {
  onReset: () => any
}

export const withErrorBoundary = <BaseProps extends InjectedProps>(BaseComponent: React.ComponentType<BaseProps>) => {
  type HocProps = Subtract<BaseProps, InjectedProps> & {
    // here you can extend hoc with new props
  }
  interface HocState {
    readonly error: Error | null | undefined
  }

  return class Hoc extends React.Component<HocProps, HocState> {
    // Enhance component name for debugging and React-Dev-Tools
    static displayName = `withErrorBoundary(${BaseComponent.name})`
    // reference to original wrapped component
    static readonly WrappedComponent = BaseComponent

    readonly state: HocState = {
      error: undefined,
    }

    componentDidCatch(error: Error | null, info: ErrorInfo) {
      this.setState({ error: error ?? new Error(MISSING_ERROR) })
      this.logErrorToCloud(error, info)
    }

    logErrorToCloud = (error: Error | null, info: ErrorInfo) => {
      // TODO: send error report to service provider
    }

    handleReset = (): any => {
      this.setState({ error: undefined })
    }

    render() {
      const { children, ...restProps } = this.props as {
        children: React.ReactNode
      }
      const { error } = this.state

      if (error) {
        return (
          // @ts-ignore
          <BaseComponent
            onReset={this.handleReset} // injected
            {...restProps}
          />
        )
      }

      return children
    }
  }
}

export const ErrorBoundary = withErrorBoundary(ErrorMessage)
