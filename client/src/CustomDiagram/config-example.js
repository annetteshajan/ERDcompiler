import Entity from "./entity/component";
import Relationship from "./relationship/component";
import Attribute from "./attribute/component";
import WeakEntity from "./weakEntity/component";
import WeakRelationship from "./weakRelationship/component";
import MultiAttribute from "./multiAttribute/component";
import entityIcon from "./entity/icon";
import relationshipIcon from "./relationship/icon";
import attributeIcon from "./attribute/icon";
import weakEntityIcon from "./weakEntity/icon";
import weakRelationshipIcon from "./weakRelationship/icon";
import multiAttributeIcon from "./multiAttribute/icon";
import PrimaryKey from "./primaryKey/component";
import primaryKeyIcon from "./primaryKey/icon";

const config = {
  entityTypes: {
    Entity: {
      width: 100,
      height: 75
    },
    Relationship: {
      width: 50,
      height: 50
    },
    PrimaryKey: {
      width: 100,
      height: 50
    },
    Attribute: {
      width: 100,
      height: 50
    },
    WeakEntity: {
      width: 100,
      height: 75
    },
    WeakRelationship: {
      width: 50,
      height: 50
    },
    MultiAttribute: {
      width: 100,
      height: 50
    }
  },
  gridSize: 10
};

const customEntities = {
  Entity: {
    component: Entity,
    icon: entityIcon
  },
  Relationship: {
    component: Relationship,
    icon: relationshipIcon
  },
  PrimaryKey: {
    component: PrimaryKey,
    icon: primaryKeyIcon
  },
  Attribute: {
    component: Attribute,
    icon: attributeIcon
  },
  WeakEntity: {
    component: WeakEntity,
    icon: weakEntityIcon
  },
  WeakRelationship: {
    component: WeakRelationship,
    icon: weakRelationshipIcon
  },
  MultiAttribute: {
    component: MultiAttribute,
    icon: multiAttributeIcon
  }
};

export { config, customEntities };
