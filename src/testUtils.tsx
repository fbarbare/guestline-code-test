import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import merge from 'deepmerge';

type Lazy<A> = () => A;
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

interface RendererOptions<P> {
  Component: React.FC<P>;
  defaultProps: Lazy<P>;
}

export function buildRenderer<P>(opts: RendererOptions<P>) {
  const renderFn = async (partialProps: DeepPartial<P> = {}) => {
    const props = merge(opts.defaultProps(), partialProps as Partial<P>);

    const rendered = await render(<opts.Component {...props} />);
    return { ...rendered, props };
  };

  return renderFn;
}

export function buildRendererSync<P>(opts: RendererOptions<P>) {
  const renderFn = (partialProps: DeepPartial<P> = {}) => {
    const props = merge(opts.defaultProps(), partialProps as Partial<P>);

    const rendered = render(<opts.Component {...props} />);
    return { ...rendered, props };
  };

  return renderFn;
}

export const render = (innerComponent: JSX.Element) => {
  let component: ReactWrapper;
  act(() => {
    component = mount(innerComponent);
  });

  component!.update();

  return { component: component!, ...getComponentUtils(component!) };
};

function getComponentUtils<P>(component: ReactWrapper<P>) {
  const delay = async (time = 0) => {
    await act(async () => {
      await new Promise((res) => setTimeout(res, time));
    });
    component.update();
  };

  const click = (selector: string) => {
    act(() => {
      component.find(selector).simulate('click');
    });
    component.update();
  };

  const submit = (selector: string) => {
    act(() => {
      component.find(selector).simulate('submit');
    });
    component.update();
  };

  const unmount = () => {
    component.unmount();
  };

  const changeInput = (selector: string, value: string | boolean) => {
    act(() => {
      if (typeof value === 'boolean') {
        component.find(selector).simulate('change', { target: { checked: value } });
      } else {
        component.find(selector).simulate('change', { target: { value } });
      }
    });
    component.update();
  };

  const setProps = (...args: Parameters<typeof component['setProps']>) => {
    act(() => {
      component.setProps(...args);
    });
    component.update();
  };

  return {
    delay,
    changeInput,
    setProps,
    click,
    submit,
    unmount
  };
}
