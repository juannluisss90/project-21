import React from 'react';
import { Component } from './types';
import { cn } from '~/lib/utils';
import { ComponentBuilder } from '~/components/Builder';
import { PropertyEditor } from '~/components/Builder/PropertyEditor';
import { BindingProperties } from '~/components/Builder/BindingProperties';
import { useBoundValue } from '~/hooks/useBoundValue';
import { commonProperties } from './types';

interface EditorProps {
  'data-component-id': string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}


interface WidgetProps {
  component: Component;
  children?: React.ReactNode;
  editorProps?: EditorProps;
}

export const divConfig = {
  type: 'div',
  props: {
    className: {
      order: 0,
      section: 'basic',
      type: 'string',
      displayName: 'CSS Classes',
      bindable: false,
      defaultValue: "",
      value : "",
      bindValue:"",
    },
    style: {
      order: 1,
      section: 'basic',
      type: 'object',
      displayName: 'Inline Styles',
      bindable: false,
      defaultValue: {},
      value : {},
      bindValue:""
    },
    ...commonProperties
  },
  sections: {
    basic: {
      name: 'Basic',
      order: 0
    },
    binding: {
      name: 'Binding',
      order: 1
    }
  }
};

const componentRenderer: React.FC<WidgetProps> = React.memo(({ component, children, editorProps={} }) => {
  const className = useBoundValue(component.id, 'className');
  const style = useBoundValue(component.id, 'style');
  return (
    <div className={cn(className )}  {...editorProps}>
      {Array.isArray(children) && children.length > 0 ? children : (<span className=' h-12 w-12 flex justify-center items-center text-center'>no content</span>)}
    </div>
  );
});

componentRenderer.displayName = 'DivWidget';

export const divWidget = new ComponentBuilder()
  .setType(divConfig.type)
  .setDefaultProps(
    Object.entries(divConfig.props).reduce((props, [key, config]) => ({
      ...props,
      [key]: config.defaultValue
    }), {})
  ).addPropertySection({
    name: divConfig.sections.basic.name,
    view: (props) => <PropertyEditor {...props} config={divConfig} />
  })
  .addPropertySection({
    name: divConfig.sections.binding.name,
    view: (props) => <PropertyEditor {...props} config={divConfig} />
  })
 
  .setRender(componentRenderer)
  .build();