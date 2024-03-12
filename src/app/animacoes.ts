import { animate, keyframes, query, stagger, state, style, transition, trigger } from "@angular/animations";

export const listStateTrigger = trigger('listState', [
  transition('* => *', [
    query(':self', [
        style({
        opacity: 0,
        transform: 'translateX(100%)'
      }),
      stagger(
        200, [animate('300ms ease-out', keyframes([
          style({
            opacity: 1,
            transform: 'translateX(15%)',
            offset: 0.4
          }),
          style({
            opacity: 1,
            transform: 'translateX(0)',
            offset: 1
          }),
        ]))
      ]),
    ])
  ])
]);

export const highlightedStateTrigger = trigger('highlightedState', [
  state('default', style({

  })),
  state('highlighted', style({
    // 'background': '#FFF',
    'font-weight': '500',
    filter: 'brightness(92%)'
  })),
  transition('default => highlighted', [
    animate('200ms ease-out', style({
      transform: 'scale(1.02)'
    })),
    animate(200)
  ])
])

export const enabledButtonTrigger = trigger('enabledButton', [
  transition('* => enabled', [
    animate('400ms ease-in', style({
      transform: 'scale(0.4)'
    }))
  ])
])

export const shakeTrigger = trigger('shakeAnimation', [
  transition('* => invalido', [
    animate('0.5s', keyframes([
      style({ border: '2px solid red' }),
      style({ transform: 'translateX(-10px)' }),
      style({ transform: 'translateX(10px)' }),
      style({ transform: 'translateX(-10px)' }),
      style({ transform: 'translateX(10px)' }),
      style({ transform: 'translateX(-10px)' }),
      style({ transform: 'translateX(10px)' }),
      style({ transform: 'translateX(0)' })
    ]))
  ])
])

export const invalidShakeTrigger = trigger('invalidShakeAnimation', [
  transition('* => invalido', [
    query('input.ng-invalid, select.ng-invalid', [
      animate('0.5s', keyframes([
        style({ border: '2px solid red' }),
        style({ transform: 'translateX(-10px)' }),
        style({ transform: 'translateX(10px)' }),
        style({ transform: 'translateX(-10px)' }),
        style({ transform: 'translateX(10px)' }),
        style({ transform: 'translateX(-10px)' }),
        style({ transform: 'translateX(10px)' }),
        style({ transform: 'translateX(0)' })
      ]))
    ], { optional: true })
  ])
])
