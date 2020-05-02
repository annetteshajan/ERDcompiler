// @flow

import React from "react";
import style from "styled-components";

import type { DiagComponentProps } from "react-flow-diagram";

/*
 * Presentational
 * ==================================== */

const MultiAttributeStyle = style.div`
  background-color: #fff;
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  align-items: ${props => (props.isEditing ? "stretch" : "center")};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-radius: 50%;
  border: 2px solid #888;
  justify-content: center;
  font-size: .5rem;
  box-shadow: -2px -2px currentcolor, 
               2px 2px currentcolor,
               
               inset -2px 2px currentcolor, 
               inset 2px -2px currentcolor;
`;

const Name = style.span`
  flex: 1 0;
  padding: .5em;
  font-size: .8rem;
`;

const EditName = style.textarea`
  
  padding: .5em;
  border: none;
  font-size: .8rem;
  text-align: center;
  border-radius: .1rem;
  resize: none;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
`;

export type MultiAttributeProps = DiagComponentProps & {
  name: string,
  isEditing: boolean,
  toggleEdit: boolean => void,
  refreshName: (SyntheticEvent<HTMLTextAreaElement>) => void,
  handleKeyPress: (SyntheticKeyboardEvent<HTMLTextAreaElement>) => void,
  handleRef: HTMLTextAreaElement => void
};
const MultiAttribute = (props: MultiAttributeProps) => (
  <MultiAttributeStyle width={props.model.width} height={props.model.height}>
    <EditName
      value={props.name}
      onChange={props.refreshName}
      onKeyDown={props.handleKeyPress}
      innerRef={textarea => props.handleRef(textarea)}
      style={{ display: props.isEditing ? "block" : "none" }}
    />
    <Name
      onDoubleClick={() => props.toggleEdit(true)}
      style={{ display: !props.isEditing ? "block" : "none" }}
    >
      {props.model.name}
    </Name>
  </MultiAttributeStyle>
);

/*
 * Container
 * ==================================== */

type MultiAttributeComponentProps = DiagComponentProps;
type MultiAttributeComponentState = {
  isEditing: boolean,
  name: string
};
class MultiAttributeComponent extends React.PureComponent<
  MultiAttributeComponentProps,
  MultiAttributeComponentState
> {
  textarea: ?HTMLTextAreaElement;

  state = {
    isEditing: false,
    name: this.props.model.name
  };

  componentWillUnmount() {
    this.textarea = null;
  }

  handleRef = (textarea: HTMLTextAreaElement) => {
    if (!this.textarea) {
      this.textarea = textarea;
    }
  };

  toggleEdit = (isEditing: boolean) => {
    const { textarea } = this;
    if (isEditing && textarea) {
      setTimeout(() => textarea.focus(), 16 * 4);
    }
    this.setState({ isEditing });
  };

  refreshName = (ev: SyntheticEvent<HTMLTextAreaElement>) => {
    this.setState({ name: ev.currentTarget.value });
  };

  handleKeyPress = (ev: SyntheticKeyboardEvent<HTMLTextAreaElement>) => {
    switch (ev.key) {
      case "Enter":
        this.toggleEdit(false);
        this.props.setName({ id: this.props.model.id, name: this.state.name });
        break;
      case "Escape":
        this.toggleEdit(false);
        this.setState({ name: this.props.model.name });
        break;
      // no default
    }
  };

  render() {
    return (
      <MultiAttribute
        {...this.props}
        isEditing={this.state.isEditing}
        name={this.state.name}
        toggleEdit={this.toggleEdit}
        refreshName={this.refreshName}
        handleKeyPress={this.handleKeyPress}
        handleRef={this.handleRef}
      />
    );
  }
}

export default MultiAttributeComponent;
