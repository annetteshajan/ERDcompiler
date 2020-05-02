// @flow

import React from "react";
import style from "styled-components";

import type { DiagComponentProps } from "react-flow-diagram";

/*
 * Presentational
 * ==================================== */

const WeakRelationshipStyle = style.div`
  background-color: #fff;
  display: flex;
  flex-flow: row nowrap;
  align-items: ${props => (props.isEditing ? "stretch" : "center")};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  transform:rotate(45deg);
  border: 2px solid #888;
  outline-style:double;
`;

const Name = style.span`
  flex: 1 0;
  padding: .5em;
  font-size: .8rem;
  transform:rotate(-45deg);

`;

const EditName = style.textarea`
  padding: .5em;
  transform:rotate(-45deg);

  font-size: .8rem;
  text-align: center;
  resize: none;
  border: none;
  border-radius: .5rem;
`;

export type WeakRelationshipProps = DiagComponentProps & {
  name: string,
  isEditing: boolean,
  toggleEdit: boolean => void,
  refreshName: (SyntheticEvent<HTMLTextAreaElement>) => void,
  handleKeyPress: (SyntheticKeyboardEvent<HTMLTextAreaElement>) => void,
  handleRef: HTMLTextAreaElement => void
};
const WeakRelationship = (props: EntityProps) => (
  <WeakRelationshipStyle
    width={props.model.width}
    height={props.model.height}
    isEditing={props.isEditing}
  >
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
  </WeakRelationshipStyle>
);

/*
 * Container
 * ==================================== */

type WeakRelationshipComponentProps = DiagComponentProps;
type WeakRelationshipComponentState = {
  isEditing: boolean,
  name: string
};
class WeakRelationshipComponent extends React.PureComponent<
  WeakRelationshipComponentProps,
  WeakRelationshipComponentState
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
      <WeakRelationship
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

export default WeakRelationshipComponent;
