import { Theme, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { configuration } from 'utils'

import { GridContainer, GridItem } from './Grid'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    banner: {
      maxWidth: '100%',
      width: 'auto',
      height: 'auto',
      padding: '5px 5px 0px 12px',
      marginBottom: '-12px',
    },
  })
)

const Logo: React.FC<{ dates: string; className: string; virtual?: boolean }> = ({
  dates,
  className,
  virtual = false,
}) => {
  // const background = '#ffffff'
  const purple = '#31107b' // '#39177a'
  const red = '#ce0000'
  const yellow = '#ffce00'
  const virtualColor = '#ec0202'
  return (
    <svg
      width='550px'
      height='139px'
      viewBox='0 0 550 139'
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      className={className}
    >
      <g id='group-NW'>
        <path
          id='Path'
          d='M430.02 26.31 C431.56 27.43 433.07 28.61 434.48 29.9 433.07 33.66 431.81 37.53 430.03 41.14 427.93 44.88 425.19 48.31 422.75 51.84 420.76 54.65 419.77 58.02 418.08 61.11 416.17 64.65 414.01 67.88 412.9 71.81 409.34 83.75 404.43 95.45 401.46 107.55 399.82 114.2 400.42 120.71 401.61 127.37 402.37 129.6 399.28 131.54 398.08 133.14 396.06 132.44 394.03 131.76 392.03 131.01 389.55 128.82 387.65 126.37 387.19 123.01 385.61 117.94 384.45 112.93 383.54 107.7 382.36 93.28 379.35 79.25 379.4 64.68 378.72 63.99 378.01 63.34 377.27 62.72 376.35 64.35 375.54 66.03 374.73 67.72 374.19 67.48 373.65 67.25 373.11 67.01 372.54 66.43 371.97 65.84 371.4 65.25 372.94 61.56 374.51 57.9 376.29 54.31 377.44 51.54 378.83 49.1 378.29 46 378.14 42.6 376.84 39.82 375.45 36.8 376 34.87 377.32 33.08 378.5 31.47 380.27 30.53 382.15 29.63 384.09 29.06 388.09 29.57 391.08 31.89 393.88 34.61 392.43 37.35 392.78 40.02 392.76 43 392.77 47.46 391.14 51.51 391.02 55.96 390.82 63.66 390.86 71.37 391.45 79.06 391.72 86.45 392.39 93.77 394.02 100.99 394.33 102.67 395.3 103.86 396.33 105.15 L397.23 106.3 C400.18 102.76 401.23 98.1 402.61 93.71 403.87 88.75 405.39 84 407.22 79.23 410.67 70.23 412.84 60.05 417.78 51.77 419.47 49.08 418.04 46.84 417.4 44.09 418.82 42.22 420.29 40.54 421.47 38.5 424.23 33.97 425.25 29.34 430.02 26.31 Z'
          fill={red}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-1'
          d='M519.64 27.41 C517.56 31.03 513.61 33.72 510.56 36.59 505.91 40.5 502.67 45.17 498.98 49.97 494.68 56.1 490.53 62.46 486.88 68.99 484.01 74.03 481.21 79.01 479.42 84.55 476.39 93.4 471.28 101.84 468.98 110.85 467.27 118.32 466.34 125.56 462.86 132.51 461.51 132.48 460.16 132.44 458.81 132.42 457.5 131.22 456.24 129.96 454.96 128.74 455.07 123.57 456.25 118.59 456.68 113.45 457.14 109.15 458.89 105.41 458.78 101.01 458.61 92.86 459.73 84.88 460.65 76.81 460.76 75.46 460.82 74.1 460.83 72.74 456.75 76.16 454.67 80.46 451.82 84.82 447.57 91.4 443.94 98.21 439.99 104.98 435.26 112.98 431.45 121.78 427.74 130.33 425.79 130.01 423.85 129.69 421.93 129.24 418.11 126.49 420.1 122.95 419.92 119 420.16 115.22 419.18 112.02 420.65 108.67 422.87 103.67 422.73 97.42 423.15 91.99 423.59 82.41 426.15 73.43 429.53 64.52 431.86 57.08 434.54 49.79 437.72 42.67 439.14 38.59 441.44 35.05 443.62 31.36 448.37 30.86 452.26 30.77 455.57 34.75 452.95 42.82 450.01 50.95 446.65 58.74 442.32 66.53 439.32 74.83 435.87 83.03 434.27 86.39 431.92 89.21 430.75 92.82 428.88 98.69 427.64 104.5 430.02 110.46 L430.95 109.13 C434.52 104.21 437.14 98.57 440.43 93.44 447.64 81.48 455.34 69.24 461.73 56.76 463.2 53.66 463.63 50.12 464.76 46.87 467.47 46.28 470.14 45.58 472.81 44.84 473.75 45.75 474.68 46.64 475.59 47.57 473.14 57.67 470 67.56 467.62 77.69 464.66 86.35 464.02 94.15 465.18 103.23 465.87 102.02 466.54 100.8 467.18 99.57 472.23 89.08 477.39 78.46 483.63 68.63 491.96 57.41 497.41 46.15 507.63 36.64 511.27 33.42 515 29.09 519.64 27.41 Z'
          fill={red}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-2'
          d='M434.48 29.9 C435.3 30.85 436.03 31.83 436.45 33.02 435.39 36.29 433.88 39.41 432.73 42.65 429.43 48.51 424.34 53.68 421.97 60.02 420.02 64.83 416.76 68.41 415.32 73.36 411.59 86.29 405.88 98.94 403.18 112.13 401.98 118.6 403.03 124.56 403.94 130.94 403.11 132.74 401.25 134.17 399.95 135.67 397.12 134.27 394.4 133.16 392.03 131.01 394.03 131.76 396.06 132.44 398.08 133.14 399.28 131.54 402.37 129.6 401.61 127.37 400.42 120.71 399.82 114.2 401.46 107.55 404.43 95.45 409.34 83.75 412.9 71.81 414.01 67.88 416.17 64.65 418.08 61.11 419.77 58.02 420.76 54.65 422.75 51.84 425.19 48.31 427.93 44.88 430.03 41.14 431.81 37.53 433.07 33.66 434.48 29.9 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-3'
          d='M522.36 29.58 C518.82 34.16 513.72 37.53 509.7 41.7 501.64 50.51 495.65 60.31 489.41 70.41 486.68 75.69 483.28 80.99 481.66 86.7 478.74 95.31 473.8 103.56 471.34 112.34 469.69 119.85 468.42 128.35 464.79 135.17 462.65 134.5 460.59 133.85 458.81 132.42 460.16 132.44 461.51 132.48 462.86 132.51 466.34 125.56 467.27 118.32 468.98 110.85 471.28 101.84 476.39 93.4 479.42 84.55 481.21 79.01 484.01 74.03 486.88 68.99 491.4 63.61 494.66 57.49 498.84 51.86 503.59 44.58 510.1 38.3 516.68 32.68 518.46 31.11 520.02 30.18 522.36 29.58 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-4'
          d='M393.88 34.61 C394.43 35.14 394.97 35.69 395.5 36.25 395.38 38.49 395.19 40.73 395.25 42.98 395.47 48.84 392.85 54.07 393.21 59.96 392.78 70.04 393.55 80 394.16 90.04 394.65 95.11 395.77 100.08 396.33 105.15 395.3 103.86 394.33 102.67 394.02 100.99 392.39 93.77 391.72 86.45 391.45 79.06 390.86 71.37 390.82 63.66 391.02 55.96 391.14 51.51 392.77 47.46 392.76 43 392.78 40.02 392.43 37.35 393.88 34.61 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-5'
          d='M455.57 34.75 C456.32 36.01 457.08 37.48 457.18 38.97 456.63 41.54 455.41 44.01 454.5 46.48 452.03 52.75 450.03 59.77 446.48 65.48 444.19 69.18 443.45 73.46 441.31 77.25 439.29 81.11 438.75 85.79 436.03 89.05 431.84 94.93 430.96 102.1 430.95 109.13 L430.02 110.46 C427.64 104.5 428.88 98.69 430.75 92.82 431.92 89.21 434.27 86.39 435.87 83.03 439.32 74.83 442.32 66.53 446.65 58.74 450.01 50.95 452.95 42.82 455.57 34.75 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-6'
          d='M475.59 47.57 C478.97 50.79 476.54 53.97 475.79 57.75 473.43 65.31 471.64 72.98 469.63 80.64 467.54 86.77 466.36 93.08 467.18 99.57 466.54 100.8 465.87 102.02 465.18 103.23 464.02 94.15 464.66 86.35 467.62 77.69 470 67.56 473.14 57.67 475.59 47.57 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-7'
          d='M377.27 62.72 C378.01 63.34 378.72 63.99 379.4 64.68 376.91 69.24 374.76 73.96 372.76 78.75 368.86 88.15 364.67 97.42 360.83 106.84 357.21 114.92 355.19 123.63 351.79 131.82 351.02 133.45 350.12 135.64 348.43 136.5 345.81 137.66 343.11 136.86 340.75 135.49 342.76 134.99 344.97 134.68 346.86 133.77 348.46 132.41 349.37 130.09 350.18 128.19 352.38 122.27 354.28 116.24 356.34 110.28 359.75 101.51 363.59 92.91 367.27 84.25 369.46 79.13 371.47 74.05 374.04 69.08 L374.73 67.72 C375.54 66.03 376.35 64.35 377.27 62.72 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-8'
          d='M371.236 65.385 C373.07 61.64 373.642 66.895 375.122 66.855 372.552 71.825 369.46 79.13 367.27 84.25 363.59 92.91 359.75 101.51 356.34 110.28 354.28 116.24 352.38 122.27 350.18 128.19 349.37 130.09 348.46 132.41 346.86 133.77 344.97 134.68 342.76 134.99 340.75 135.49 339.26 133.81 337.44 132.27 337.16 129.91 336.63 126.2 336.83 122.48 335.86 118.81 335.15 114.22 334.9 108.81 338.28 105.17 340.42 104.28 342.79 103.85 345.03 103.3 345.76 104.02 346.48 104.73 347.19 105.46 345.56 110.67 344.99 115.82 345.26 121.27 346.25 120 347.2 118.7 348.07 117.34 351.25 113.07 352.57 108.42 354.63 103.56 357.37 97.01 359.74 90.35 363.01 84.03 365.07 78.98 368.886 70.315 371.236 65.385 Z'
          fill={red}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-9'
          d='M460.83 72.74 C460.82 74.1 460.76 75.46 460.65 76.81 455.07 85.31 449.63 93.82 444.75 102.75 439 112.33 434.11 122.37 429.99 132.75 426.73 132.38 424.35 131.5 421.93 129.24 423.85 129.69 425.79 130.01 427.74 130.33 431.45 121.78 435.26 112.98 439.99 104.98 443.94 98.21 447.57 91.4 451.82 84.82 454.67 80.46 456.75 76.16 460.83 72.74 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-10'
          d='M347.19 105.46 C347.79 106.06 348.37 106.67 348.94 107.29 348.44 110.64 347.96 113.93 348.07 117.34 347.2 118.7 346.25 120 345.26 121.27 344.99 115.82 345.56 110.67 347.19 105.46 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
      </g>
      <g id='group-AmberCon'>
        <path
          id='Path-11'
          d='M159.701 2.363 C160.421 8.063 160.161 13.673 160.181 19.393 160.161 27.003 160.221 34.613 160.131 42.223 164.251 40.133 167.761 37.823 172.641 38.353 176.141 38.633 178.711 40.663 180.901 43.233 182.521 48.533 182.871 53.943 180.311 59.013 178.141 63.333 173.561 66.203 168.711 66.063 165.861 65.933 163.351 64.703 160.711 64.223 155.061 64.963 149.421 65.603 143.711 65.273 139.641 64.993 135.611 65.073 131.551 65.253 130.381 65.203 129.211 65.103 128.051 64.963 129.501 63.933 131.001 62.973 132.501 62.003 132.701 55.973 133.031 49.783 132.261 43.783 130.451 42.233 129.181 42.123 126.881 42.313 125.021 42.363 122.401 42.853 121.171 44.343 120.531 45.313 120.111 46.193 120.091 47.393 119.861 52.193 120.081 57.033 120.191 61.843 120.951 62.363 121.711 62.883 122.471 63.423 123.271 64.013 124.061 64.653 124.831 65.333 120.061 65.133 115.351 64.993 110.581 65.283 109.561 65.283 108.541 65.273 107.521 65.253 109.051 64.083 110.641 63.023 112.231 61.953 112.581 55.883 112.611 49.813 112.091 43.763 110.381 42.763 108.951 42.073 106.901 42.233 105.031 42.123 102.791 42.623 101.431 43.993 100.901 44.523 100.411 45.063 99.941 45.643 99.321 50.983 99.751 56.513 99.921 61.883 100.601 62.353 101.261 62.823 101.931 63.293 102.731 63.893 103.511 64.513 104.271 65.173 98.061 65.033 91.911 65.183 85.701 65.293 79.191 64.773 73.111 64.833 66.601 65.363 65.521 65.253 64.441 65.113 63.371 64.953 65.591 63.133 68.141 62.883 70.861 62.303 69.851 58.223 68.591 54.203 67.001 50.313 L66.271 48.623 C60.321 48.253 54.131 48.203 48.191 48.643 46.681 53.063 45.491 57.583 44.581 62.153 45.441 62.363 46.291 62.563 47.151 62.773 49.081 63.233 50.671 63.683 52.041 65.223 45.841 65.193 39.751 64.673 33.561 65.293 32.421 65.273 31.281 65.223 30.141 65.143 33.031 61.873 37.571 64.013 39.291 59.983 44.631 50.463 48.981 40.153 53.561 30.243 56.651 23.843 58.871 17.153 61.301 10.493 61.851 11.253 62.381 12.023 62.911 12.793 63.611 18.623 65.721 23.863 67.801 29.293 71.271 38.133 74.701 46.993 78.301 55.773 79.421 58.383 80.291 60.833 82.391 62.853 85.461 63.323 88.481 63.333 91.571 63.063 92.321 57.183 92.201 51.163 91.911 45.253 91.841 44.393 91.771 43.533 91.691 42.673 90.281 42.653 88.861 42.603 87.441 42.533 86.521 42.193 85.601 41.843 84.681 41.463 89.461 40.213 94.311 39.383 98.991 37.773 99.271 38.563 99.531 39.353 99.771 40.153 99.191 42.173 100.621 42.853 102.171 41.643 105.661 39.963 109.751 38.253 113.681 38.313 116.601 38.243 118.581 40.683 120.651 42.383 124.881 40.613 129.981 37.943 134.641 38.333 136.941 38.423 138.271 39.853 139.891 41.253 140.501 48.453 139.691 55.793 140.901 62.873 L142.691 63.273 C145.631 63.963 149.151 63.993 151.751 62.313 152.801 56.493 152.171 50.293 152.331 44.393 152.151 32.923 152.771 21.373 151.901 9.933 151.931 8.903 151.491 8.253 150.561 7.963 148.851 7.683 147.131 7.483 145.431 7.193 150.001 5.163 154.911 3.833 159.701 2.363 Z M162.341 47.913 C161.741 52.483 162.241 57.173 161.801 61.783 163.611 63.083 165.311 64.243 167.671 63.923 170.431 63.483 172.241 61.413 173.241 58.933 174.991 53.993 174.851 48.433 171.951 43.943 168.231 44.553 164.671 44.453 162.341 47.913 Z M52.431 46.363 C56.761 46.403 61.101 46.403 65.441 46.363 63.421 40.803 61.381 35.253 59.221 29.743 56.711 35.183 54.471 40.743 52.431 46.363 Z M51.359 41.166 C53.779 36.656 56.109 32.026 57.909 27.226 L57.549 26.246 C54.999 30.936 53.069 36.116 51.359 41.166 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-12'
          d='M150.318 8.206 C151.248 8.496 151.688 9.146 151.658 10.176 L149.738 10.626 C147.338 10.096 148.468 8.336 150.318 8.206 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-13'
          d='M291.698 8.846 C291.748 10.856 291.668 12.846 291.468 14.846 290.628 20.686 290.498 26.556 290.608 32.456 L289.428 33.696 C288.838 30.896 288.708 27.936 287.828 25.216 286.578 22.156 284.218 19.476 281.648 17.436 275.778 12.296 266.158 13.696 261.088 19.266 256.568 24.116 254.888 31.156 254.618 37.616 254.368 44.366 255.678 51.626 260.278 56.846 264.908 62.886 272.788 64.546 279.808 61.956 284.748 60.326 287.458 56.646 291.718 54.046 290.548 58.136 287.528 60.096 284.538 62.776 275.338 67.946 264.468 67.896 255.218 62.876 251.258 59.616 248.038 55.636 246.398 50.736 244.168 44.036 244.328 36.466 246.638 29.806 250.088 20.216 259.338 13.436 269.428 12.536 276.348 11.746 282.568 13.566 289.038 15.696 289.748 13.216 289.968 10.896 291.698 8.846 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-14'
          d='M294.058 11.156 C293.988 14.556 293.548 17.906 293.238 21.276 292.778 26.176 293.008 31.066 292.418 35.966 291.788 34.806 291.168 33.646 290.608 32.456 290.498 26.556 290.628 20.686 291.468 14.846 292.288 13.586 293.158 12.366 294.058 11.156 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-15'
          d='M62.911 12.793 C65.661 16.073 65.981 20.443 67.511 24.583 72.021 37.503 77.581 50.053 82.391 62.853 80.291 60.833 79.421 58.383 78.301 55.773 74.701 46.993 71.271 38.133 67.801 29.293 65.721 23.863 63.611 18.623 62.911 12.793 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-16'
          d='M281.648 17.436 C276.888 16.386 272.408 15.716 267.878 18.056 261.018 21.516 257.918 29.336 257.138 36.586 256.198 43.606 257.478 50.396 260.278 56.846 255.678 51.626 254.368 44.366 254.618 37.616 254.888 31.156 256.568 24.116 261.088 19.266 266.158 13.696 275.778 12.296 281.648 17.436 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-17'
          d='M58.151 26.983 C58.501 27.903 58.861 28.823 59.221 29.743 56.711 35.183 54.471 40.743 52.431 46.363 51.391 46.353 50.351 46.343 49.321 46.323 49.901 44.903 50.491 43.483 51.101 42.073 L51.351 41.483 51.601 40.923 C54.021 36.413 56.351 31.783 58.151 26.983 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-18'
          d='M213.041 44.053 C213.281 46.283 213.571 48.493 213.791 50.723 206.911 51.203 200.041 50.873 193.151 51.083 193.851 53.833 194.581 56.413 196.471 58.593 198.671 60.133 200.851 61.403 203.631 61.323 206.991 61.343 210.301 58.523 213.241 57.063 212.681 58.493 212.081 59.913 211.481 61.333 208.691 63.033 206.321 64.983 203.041 65.663 199.081 66.543 195.421 65.683 191.661 64.443 186.031 60.103 184.191 53.243 186.961 46.653 191.281 36.803 206.791 35.293 213.041 44.053 Z M199.571 43.313 C197.761 44.673 196.781 47.243 195.531 49.103 199.321 49.123 203.101 49.183 206.891 49.103 206.521 46.613 205.981 44.213 204.971 41.893 203.191 42.313 201.271 42.583 199.571 43.313 Z M197.318 41.146 C198.618 41.906 199.648 41.666 200.418 40.396 199.198 39.896 198.168 40.146 197.318 41.146 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-19'
          d='M228.388 38.206 C228.828 38.836 229.268 39.456 229.708 40.086 229.618 42.036 229.508 43.976 229.438 45.916 230.248 44.806 231.058 43.676 231.888 42.566 233.628 40.366 235.408 38.286 238.438 38.126 240.278 37.986 241.688 39.356 243.098 40.336 242.848 42.026 242.608 43.706 242.348 45.396 240.878 45.906 239.398 46.386 237.908 46.856 L237.138 46.156 C236.328 45.416 235.528 44.686 234.678 43.986 L234.208 43.596 C233.008 44.096 232.238 44.996 231.888 46.316 229.838 51.586 229.488 56.816 230.268 62.386 L232.118 62.916 C234.248 63.506 236.228 63.766 237.818 65.476 231.638 65.466 225.528 65.036 219.348 65.596 218.138 65.436 216.958 65.216 215.778 64.926 217.778 64.046 219.788 63.336 221.878 62.726 222.368 56.946 222.338 51.076 222.128 45.276 221.938 44.426 221.728 43.566 221.498 42.716 219.958 42.836 218.408 42.976 216.868 43.146 216.248 42.606 215.628 42.046 215.008 41.486 219.538 40.576 224.018 39.756 228.388 38.206 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-20'
          d='M319.798 39.236 C324.018 40.196 327.168 42.946 329.638 46.386 330.388 52.056 330.888 57.266 326.428 61.606 319.718 67.716 311.448 66.846 303.288 64.736 300.838 62.876 298.418 60.686 297.298 57.736 295.258 52.206 296.758 45.376 301.688 41.856 306.638 38.196 313.998 37.886 319.798 39.236 Z M309.588 45.766 C305.918 50.836 307.108 57.206 308.208 62.896 310.168 63.806 311.938 64.806 314.178 64.376 317.258 63.886 319.438 61.646 320.588 58.856 322.638 53.356 322.278 47.026 318.638 42.256 315.158 42.876 311.898 42.626 309.588 45.766 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-21'
          d='M345.398 38.216 C345.868 38.866 346.338 39.516 346.788 40.176 345.768 42.106 347.188 43.246 348.898 41.936 352.708 40.066 357.138 38.426 361.428 38.546 363.768 38.546 365.258 39.876 366.938 41.286 368.088 48.236 367.058 55.236 367.898 62.166 368.498 62.596 369.138 62.986 369.788 63.336 370.478 63.526 371.168 63.706 371.858 63.886 372.428 64.476 372.998 65.066 373.568 65.646 368.448 65.236 363.418 65.196 358.298 65.486 356.938 65.506 355.578 65.486 354.208 65.436 355.948 64.296 357.788 63.336 359.648 62.396 360.038 56.466 360.278 50.396 359.548 44.486 359.068 43.846 358.578 43.216 358.068 42.596 356.588 42.496 355.118 42.476 353.638 42.526 351.748 42.476 349.498 42.806 348.128 44.236 347.018 45.346 346.438 45.966 346.488 47.646 346.378 51.896 346.298 56.216 346.588 60.456 346.598 61.546 347.198 62.416 348.378 63.046 349.528 63.826 350.668 64.606 351.708 65.536 346.968 65.476 342.268 65.086 337.518 65.466 335.698 65.526 333.878 65.466 332.058 65.356 334.128 64.216 336.428 63.476 338.428 62.216 339.188 56.726 338.868 51.016 338.648 45.486 338.578 44.636 338.498 43.786 338.428 42.936 337.018 42.886 335.618 42.816 334.218 42.716 333.188 42.526 332.168 42.316 331.148 42.086 335.708 40.276 340.698 39.676 345.398 38.216 Z'
          fill={purple}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-22'
          d='M99.771 40.153 C100.991 40.023 101.781 40.513 102.171 41.643 100.621 42.853 99.191 42.173 99.771 40.153 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-23'
          d='M200.418 40.396 C201.888 40.906 203.338 41.456 204.728 42.136 202.948 42.556 201.028 42.826 199.328 43.556 197.518 44.916 196.538 47.486 195.288 49.346 L193.198 49.386 C193.788 45.746 194.548 43.666 197.318 41.146 198.618 41.906 199.648 41.666 200.418 40.396 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-24'
          d='M229.708 40.086 C230.438 40.916 231.158 41.736 231.888 42.566 231.058 43.676 230.248 44.806 229.438 45.916 229.508 43.976 229.618 42.036 229.708 40.086 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-25'
          d='M243.098 40.336 C244.848 42.446 246.098 46.916 243.028 48.416 240.678 49.356 239.618 48.316 237.908 46.856 239.398 46.386 240.878 45.906 242.348 45.396 242.608 43.706 242.848 42.026 243.098 40.336 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-26'
          d='M311.618 40.726 C314.258 39.946 316.438 40.876 318.638 42.256 315.158 42.876 311.898 42.626 309.588 45.766 305.918 50.836 307.108 57.206 308.208 62.896 304.538 58.586 304.168 52.856 305.428 47.536 306.348 44.356 308.168 41.466 311.618 40.726 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-27'
          d='M346.788 40.176 C347.938 40.416 348.638 41.006 348.898 41.936 347.188 43.246 345.768 42.106 346.788 40.176 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        {/*<path id='Path-28' d='M51.109 41.726 L50.859 42.316 Z' fill='#ffffff' fillOpacity='1' stroke='none' />*/}
        <path
          id='Path-29'
          d='M139.891 41.253 C141.581 43.213 142.251 44.893 142.391 47.483 142.641 52.743 142.361 58.013 142.691 63.273 L140.901 62.873 C139.691 55.793 140.501 48.453 139.891 41.253 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-30'
          d='M166.751 42.013 C168.811 41.783 170.311 42.893 171.951 43.943 168.231 44.553 164.671 44.453 162.341 47.913 161.741 52.483 162.241 57.173 161.801 61.783 161.121 61.263 160.441 60.733 159.761 60.193 159.811 55.283 159.801 50.373 159.791 45.463 161.861 44.063 164.181 42.183 166.751 42.013 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-31'
          d='M366.938 41.286 C368.278 42.846 369.368 44.486 369.518 46.616 369.968 52.156 369.638 57.776 369.788 63.336 369.138 62.986 368.498 62.596 367.898 62.166 367.058 55.236 368.088 48.236 366.938 41.286 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-32'
          d='M87.441 42.533 C88.861 42.603 90.281 42.653 91.691 42.673 91.771 43.533 91.841 44.393 91.911 45.253 90.441 44.953 88.971 44.663 87.501 44.373 87.481 43.763 87.461 43.143 87.441 42.533 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-33'
          d='M106.901 42.233 C108.951 42.073 110.381 42.763 112.091 43.763 108.641 44.483 105.331 45.383 102.101 46.813 101.871 52.303 101.931 57.793 101.931 63.293 101.261 62.823 100.601 62.353 99.921 61.883 99.751 56.513 99.321 50.983 99.941 45.643 100.339 45.152 100.752 44.689 101.191 44.237 103.536 45.084 105.045 44.129 106.652 42.484 106.734 42.402 106.818 42.318 106.901 42.233 Z M101.431 43.993 C101.435 43.995 101.44 43.996 101.444 43.998 101.38 44.054 101.317 44.111 101.255 44.17 101.313 44.111 101.372 44.052 101.431 43.993 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-34'
          d='M126.881 42.313 C129.181 42.123 130.451 42.233 132.261 43.783 129.201 44.573 124.701 45.013 122.451 47.463 121.881 52.723 122.261 58.143 122.471 63.423 121.711 62.883 120.951 62.363 120.191 61.843 120.081 57.033 119.861 52.193 120.091 47.393 120.109 46.306 120.455 45.482 120.996 44.616 123.391 45.667 124.728 44.481 126.3 42.898 126.49 42.709 126.683 42.513 126.881 42.313 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-35'
          d='M216.868 43.146 C218.408 42.976 219.958 42.836 221.498 42.716 221.728 43.566 221.938 44.426 222.128 45.276 220.068 44.986 218.368 44.776 216.868 43.146 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-36'
          d='M334.218 42.716 C335.618 42.816 337.018 42.886 338.428 42.936 338.498 43.786 338.578 44.636 338.648 45.486 337.148 45.196 335.658 44.906 334.158 44.626 334.178 43.986 334.198 43.356 334.218 42.716 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-37'
          d='M358.068 42.596 C358.578 43.216 359.068 43.846 359.548 44.486 355.588 44.526 352.358 45.416 348.778 47.026 348.488 52.356 348.628 57.706 348.378 63.046 347.198 62.416 346.598 61.546 346.588 60.456 346.298 56.216 346.378 51.896 346.488 47.646 346.438 45.966 347.018 45.346 348.128 44.236 350.448 45.146 352.018 44.106 353.638 42.526 355.118 42.476 356.588 42.496 358.068 42.596 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-38'
          d='M180.901 43.233 C187.811 50.323 184.431 65.693 174.241 67.903 169.091 69.453 165.361 65.763 160.341 66.863 150.451 68.203 140.691 66.923 130.781 67.573 131.041 66.803 131.291 66.023 131.551 65.253 135.611 65.073 139.641 64.993 143.711 65.273 149.421 65.603 155.061 64.963 160.711 64.223 163.351 64.703 165.861 65.933 168.711 66.063 173.561 66.203 178.141 63.333 180.311 59.013 182.871 53.943 182.521 48.533 180.901 43.233 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-39'
          d='M237.138 46.156 C235.878 47.056 234.588 47.666 233.918 49.146 231.978 53.236 232.148 58.476 232.118 62.916 L230.268 62.386 C229.488 56.816 229.838 51.586 231.888 46.316 233.558 46.586 234.188 45.326 234.678 43.986 235.528 44.686 236.328 45.416 237.138 46.156 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-40'
          d='M212.798 44.296 C215.278 46.926 215.618 49.916 215.738 53.376 208.958 53.486 202.198 53.296 195.418 53.536 195.698 55.306 195.978 57.066 196.228 58.836 194.338 56.656 193.608 54.076 192.908 51.326 199.798 51.116 206.668 51.446 213.548 50.966 213.328 48.736 213.038 46.526 212.798 44.296 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-41'
          d='M329.638 46.386 C333.838 51.276 333.248 59.406 328.668 63.846 325.678 66.786 321.488 68.136 317.388 68.456 312.318 68.776 307.308 68.096 303.288 64.736 311.448 66.846 319.718 67.716 326.428 61.606 330.888 57.266 330.388 52.056 329.638 46.386 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-42'
          d='M48.191 48.643 C54.131 48.203 60.321 48.253 66.271 48.623 L67.001 50.313 C61.561 50.583 56.161 50.513 50.711 50.523 49.241 54.533 48.011 58.583 47.151 62.773 46.291 62.563 45.441 62.363 44.581 62.153 45.491 57.583 46.681 53.063 48.191 48.643 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-43'
          d='M293.918 56.426 C292.178 61.806 286.288 65.526 281.258 67.426 272.658 70.166 262.058 69.286 255.218 62.876 264.468 67.896 275.338 67.946 284.538 62.776 288.028 61.106 290.648 58.426 293.918 56.426 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-44'
          d='M215.678 59.336 C211.798 68.776 198.868 71.696 191.418 64.686 195.178 65.926 198.838 66.786 202.798 65.906 206.078 65.226 208.448 63.276 211.238 61.576 212.678 60.746 214.168 60.016 215.678 59.336 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-45'
          d='M33.561 65.293 C39.751 64.673 45.841 65.193 52.041 65.223 52.731 65.973 53.401 66.733 54.061 67.513 46.951 67.263 39.971 67.003 32.871 67.673 33.091 66.883 33.321 66.093 33.561 65.293 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-46'
          d='M66.601 65.363 C73.111 64.833 79.191 64.773 85.701 65.293 91.911 65.183 98.061 65.033 104.271 65.173 105.121 65.913 105.941 66.673 106.771 67.443 98.391 67.173 90.051 67.863 81.701 67.213 76.481 66.963 71.401 67.453 66.201 67.683 66.331 66.903 66.471 66.133 66.601 65.363 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-47'
          d='M110.581 65.283 C115.351 64.993 120.061 65.133 124.831 65.333 125.561 66.003 126.291 66.693 127.001 67.383 121.441 67.503 115.881 67.343 110.321 67.563 110.411 66.803 110.491 66.043 110.581 65.283 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-48'
          d='M219.348 65.596 C225.528 65.036 231.638 65.466 237.818 65.476 238.498 66.186 239.168 66.916 239.828 67.646 232.728 67.666 225.648 67.436 218.548 67.806 218.818 67.066 219.078 66.326 219.348 65.596 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-49'
          d='M337.518 65.466 C342.268 65.086 346.968 65.476 351.708 65.536 352.418 66.226 353.128 66.926 353.818 67.636 347.548 67.626 341.278 67.646 335.008 67.636 335.828 66.896 336.668 66.166 337.518 65.466 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
        <path
          id='Path-50'
          d='M358.298 65.486 C363.418 65.196 368.448 65.236 373.568 65.646 374.108 65.886 374.648 66.116 375.188 66.356 L374.498 67.716 C373.018 67.756 371.538 67.746 370.048 67.756 365.838 67.626 361.668 67.636 357.468 67.806 357.738 67.036 358.018 66.256 358.298 65.486 Z'
          fill={yellow}
          fillOpacity='1'
          stroke='none'
        />
      </g>
      <text id='string' transform='matrix(1.0 0.0 0.0 1.0 6.5 73.5)'>
        <tspan x='1.0' y='30.0' fontFamily='Roboto' fontSize='34' fontWeight='700' textDecoration='none' fill={purple}>
          {dates}
        </tspan>
      </text>
      <text id='stringShadow' transform='matrix(1.0 0.0 0.0 1.0 4.0 71)'>
        <tspan x='1.0' y='30.0' fontFamily='Roboto' fontSize='34' fontWeight='700' textDecoration='none' fill={yellow}>
          {dates}
        </tspan>
      </text>
      {virtual && (
        <text
          id='virtual'
          transform='rotate(-35 50 100)
                                    translate(65 106)
                                    scale(1)'
        >
          <tspan
            x='1.0'
            y='30.0'
            fontFamily='Old Stamper'
            fontSize='38'
            fontWeight='600'
            textDecoration='none'
            fill={virtualColor}
          >
            virtual
          </tspan>
        </text>
      )}
    </svg>
  )
}

interface BannerProps {
  to?: string
}

const WrappedLogo: React.FC<BannerProps> = ({ to }) => {
  const classes = useStyles()
  const conventionStartDate = configuration.conventionStartDate
  const dateRange = `${conventionStartDate.toFormat('MMMM')} ${configuration.startDay}-${configuration.endDay}, ${
    configuration.year
  }`

  const logo = <Logo dates={dateRange} className={classes.banner} virtual={configuration.virtual} />
  return to ? <Link to={to}>{logo}</Link> : logo
}

export const Banner: React.FC<BannerProps> = ({ to }) => (
  <GridContainer justifyContent='center'>
    <GridItem xs={12}>
      <WrappedLogo to={to} />
    </GridItem>
  </GridContainer>
)
