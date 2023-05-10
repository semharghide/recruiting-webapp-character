import { useState } from 'react';
import { Table, Button } from "flowbite-react";

import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';


function App() {
  const [attributeScores, setAttributeScores] = useState({
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0,
  });
  return (
    <div className="App bg-slate-900">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <div className="flex py-10">
        <AttributeScores
          attributeScores={attributeScores}
          setAttributeScores={setAttributeScores}
        />
        <Classes attributeScores={attributeScores} />
      </div>
    </div>
  );
}

const AttributeScores = ({
  attributeScores,
  setAttributeScores,
  getAttributeModifier,
}) => {

  const spendPoints = async (attribute, points) => {
    setAttributeScores({
      ...attributeScores,
      [attribute]: attributeScores[attribute] + points,
    });
  };

  return (
    <div className="px-5">
      <Table>
        <Table.Head>
          <Table.HeadCell>Attribute</Table.HeadCell>
          <Table.HeadCell>Score</Table.HeadCell>
          <Table.HeadCell>Add/Subtract</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {ATTRIBUTE_LIST.map((attribute) => {
            return (
              <Table.Row
                key={attribute}
                className="border-gray-700 bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-white">
                  {attribute}
                </Table.Cell>
                <Table.Cell>{attributeScores[attribute]}</Table.Cell>
                <Table.Cell className="flex">
                  <Button onClick={() => spendPoints(attribute, 1)}>+</Button>
                  <Button onClick={() => spendPoints(attribute, -1)}>-</Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

const Classes = ({ attributeScores }) => {
  return (
    <div className="pr-5">
    <Table>
      <Table.Head>
        <Table.HeadCell>Class</Table.HeadCell>
        <Table.HeadCell>Requirements met</Table.HeadCell>
      </Table.Head>

      <Table.Body className="divide-y">
        <ClassItem
          classFieldName={"Barbarian"}
          attributeScores={attributeScores}
        />
        <ClassItem
          classFieldName={"Wizard"}
          attributeScores={attributeScores}
        />
        <ClassItem classFieldName={"Bard"} attributeScores={attributeScores} />
      </Table.Body>
    </Table>
    </div>
  );
};

const ClassItem = ({ classFieldName, attributeScores }) => {
  const attributeRequirementsMet = (forClassName) => {
    for (const attribute in CLASS_LIST[forClassName]) {
      if (attributeScores[attribute] < CLASS_LIST[forClassName][attribute])
        return false;
    }
    return true;
  };
  return (
    <Table.Row className="border-gray-700 bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-white">
        {classFieldName}
      </Table.Cell>
      <Table.Cell>
        {attributeRequirementsMet(classFieldName) ? "Yes" : "No"}
      </Table.Cell>
    </Table.Row>
  );
};

export default App;