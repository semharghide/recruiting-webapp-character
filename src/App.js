import { useState } from "react";
import { Table, Modal, Button, Card, TextInput } from "flowbite-react";

import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts.js";

function App() {
  const [characterName, setCharacterName] = useState("");
  const [attributeScores, setAttributeScores] = useState({
    Strength: 10,
    Dexterity: 10,
    Constitution: 10,
    Intelligence: 10,
    Wisdom: 10,
    Charisma: 10,
  });
  const getDefaultSkillPoints = () => {
    const obj = {};
    for (const item of SKILL_LIST) {
      obj[item.name] = 0;
    }

    return obj;
  };
  const [skillPoints, setSkillPoints] = useState({
    ...getDefaultSkillPoints(),
  });

  const getAttributeModifier = (attribute) => {
    return Math.floor((attributeScores[attribute] - 10) / 2);
  };

  const saveCharacter = async (event) => {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterName: characterName,
        attributeScores,
        skillPoints,
      }),
    };
    const response = await fetch(
      "https://recruiting.verylongdomaintotestwith.ca/api/{semharghide}/character",
      requestOptions
    );
    const data = await response.json();
    console.log("THIS IS THE DATA", data);
  };

  const getCharacter = async (event) => {
    const response = await fetch(
      "https://recruiting.verylongdomaintotestwith.ca/api/{semharghide}/character"
    );
    const data = await response.json();
    setAttributeScores(data.body.attributeScores);
    setSkillPoints(data.body.skillPoints);

    console.log("THIS IS THE DATA", data);
  };

  return (
    <div className="App bg-slate-900">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>

      <div className="flex pt-10 pb-3">
        <Button onClick={(event) => saveCharacter(event)}>
          Save character
        </Button>
        <TextInput
          id="saveCharacter"
          type="text"
          placeholder="Character name"
          required={true}
          onChange={(event) => {
            setCharacterName(event.target.value);
          }}
        />
      </div>

      <div className="flex">
        <Button onClick={(event) => getCharacter(event)}>Get character</Button>
      </div>

      <Card href="#">
        <h1 className="text-2xl font-bold text-white">
          Character Name: {characterName}
        </h1>
      </Card>

      <div className="flex py-10">
        <AttributeScores
          attributeScores={attributeScores}
          setAttributeScores={setAttributeScores}
          getAttributeModifier={getAttributeModifier}
        />
        <Classes attributeScores={attributeScores} />
        <Skills
          getAttributeModifier={getAttributeModifier}
          skillPoints={skillPoints}
          setSkillPoints={setSkillPoints}
        />
      </div>
    </div>
  );
}

const AttributeScores = ({
  attributeScores,
  setAttributeScores,
  getAttributeModifier,
}) => {
  const MAX_POINTS = 70;
  const spendScores = (attribute, points) => {
    let existingAttributeScores = 0;
    for (const property in attributeScores) {
      existingAttributeScores += attributeScores[property];
    }

    if (points > 0 && MAX_POINTS === existingAttributeScores) {
      alert("REACHED MAXIMUN ATTRIBUTE SCORES");
      return null;
    }

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
          <Table.HeadCell>Ability Modifier</Table.HeadCell>
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
                  <Button onClick={() => spendScores(attribute, 1)}>+</Button>
                  <Button onClick={() => spendScores(attribute, -1)}>-</Button>
                </Table.Cell>
                <Table.Cell>{getAttributeModifier(attribute)}</Table.Cell>
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
          <Table.HeadCell>
            <span className="sr-only">Show</span>
          </Table.HeadCell>
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
          <ClassItem
            classFieldName={"Bard"}
            attributeScores={attributeScores}
          />
        </Table.Body>
      </Table>
    </div>
  );
};

const ClassItem = ({ classFieldName, attributeScores }) => {
  const [showRequirements, setShowRequirements] = useState(false);
  const attributeRequirementsMet = (forClassName) => {
    for (const attribute in CLASS_LIST[forClassName]) {
      if (attributeScores[attribute] < CLASS_LIST[forClassName][attribute])
        return false;
    }
    return true;
  };

  const getRequirementsText = (forClassName) => {
    let requirements = "";
    for (const attribute in CLASS_LIST[forClassName]) {
      requirements += `${attribute} : ${CLASS_LIST[forClassName][attribute]} \n`;
    }
    return requirements;
  };
  return (
    <Table.Row className="border-gray-700 bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-white">
        {classFieldName}
      </Table.Cell>
      <Table.Cell>
        {attributeRequirementsMet(classFieldName) ? "Yes" : "No"}
      </Table.Cell>
      <Table.Cell>
        <Button onClick={() => setShowRequirements(true)}>Show</Button>
        <Modal
          show={showRequirements}
          size="sm"
          onClose={() => setShowRequirements(false)}
        >
          <Modal.Header>{classFieldName + " requirements"}</Modal.Header>
          <Modal.Body>
            <p className="text-white">{getRequirementsText(classFieldName)}</p>
          </Modal.Body>
        </Modal>
      </Table.Cell>
    </Table.Row>
  );
};

const Skills = ({ getAttributeModifier, skillPoints, setSkillPoints }) => {
  let pointsAvailable = 10 + 4 * getAttributeModifier("Intelligence");
  if (pointsAvailable < 0) pointsAvailable = 0;

  const spendPoints = (skill, pointToSpend) => {
    let existingSkillPoints = 0;
    for (const property in skillPoints) {
      existingSkillPoints += skillPoints[property];
    }

    if (pointToSpend > 0 && pointsAvailable === existingSkillPoints) {
      alert("REACHED MAXIMUN POINTS");
      return null;
    }

    if (pointToSpend < 0 && existingSkillPoints === 0) {
      alert("REACHED MINIMUM POINTS");
      return null;
    }
    setSkillPoints({
      ...skillPoints,
      [skill]: skillPoints[skill] + pointToSpend,
    });
  };

  const getSkillTotalValue = (skill) => {
    const spentAndModifier =
      skillPoints[skill.name] + getAttributeModifier(skill.attributeModifier);
    if (spentAndModifier < 0) {
      return 0;
    }
    return spentAndModifier;
  };

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Skill</Table.HeadCell>
        <Table.HeadCell>Points spent</Table.HeadCell>
        <Table.HeadCell>Add/Subtract</Table.HeadCell>
        <Table.HeadCell>Modifier</Table.HeadCell>
        <Table.HeadCell>Total</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell className="text-xl font-medium text-white">
            Total points available {pointsAvailable}
          </Table.Cell>
        </Table.Row>
        {SKILL_LIST.map((skill) => {
          return (
            <Table.Row key={skill.name} className="border-gray-700 bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-white">
                {skill.name}
              </Table.Cell>
              <Table.Cell>{skillPoints[skill.name]}</Table.Cell>
              <Table.Cell className="flex">
                <Button onClick={() => spendPoints(skill.name, 1)}>+</Button>
                <Button onClick={() => spendPoints(skill.name, -1)}>-</Button>
              </Table.Cell>
              <Table.Cell>{`${skill.attributeModifier} ${getAttributeModifier(
                skill.attributeModifier
              )}`}</Table.Cell>
              <Table.Cell>{getSkillTotalValue(skill)}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default App;
