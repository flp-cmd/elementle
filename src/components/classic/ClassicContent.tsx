"use client";

import { useState, useEffect } from "react";
import { Box, Text, ActionIcon, Flex, Autocomplete } from "@mantine/core";
import { ChemicalElement, GuessResult } from "@/types/element";
import { getRandomElement, findElementByName, elements } from "@/data/elements";
import { FaArrowRight } from "react-icons/fa";

export default function ClassicContent() {
  const [targetElement, setTargetElement] = useState<ChemicalElement | null>(
    null
  );
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<
    Array<{ element: ChemicalElement; results: GuessResult[] }>
  >([]);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    setTargetElement(getRandomElement());
  }, []);

  const compareElements = (
    guessedElement: ChemicalElement,
    target: ChemicalElement
  ): GuessResult[] => {
    const results: GuessResult[] = [];

    // Family comparison
    results.push({
      property: "family",
      status: guessedElement.family === target.family ? "correct" : "wrong",
    });

    // Physical state comparison
    results.push({
      property: "physicalState",
      status:
        guessedElement.physicalState === target.physicalState
          ? "correct"
          : "wrong",
    });

    // Atomic number comparison
    if (guessedElement.atomicNumber === target.atomicNumber) {
      results.push({
        property: "atomicNumber",
        status: "correct",
      });
    } else {
      results.push({
        property: "atomicNumber",
        status: "wrong",
        direction:
          guessedElement.atomicNumber < target.atomicNumber
            ? "higher"
            : "lower",
      });
    }

    // Discovery year comparison
    if (guessedElement.discoveryYear === target.discoveryYear) {
      results.push({
        property: "discoveryYear",
        status: "correct",
      });
    } else {
      results.push({
        property: "discoveryYear",
        status: "wrong",
        direction:
          guessedElement.discoveryYear < target.discoveryYear
            ? "higher"
            : "lower",
      });
    }

    return results;
  };

  const handleSubmit = () => {
    if (!guess.trim() || !targetElement) return;

    const guessedElement = findElementByName(guess.trim());
    if (!guessedElement) {
      alert("Elemento não encontrado! Tente novamente.");
      return;
    }

    const results = compareElements(guessedElement, targetElement);
    setGuesses((prev) => [...prev, { element: guessedElement, results }]);

    if (
      guessedElement.name.toLowerCase() === targetElement.name.toLowerCase()
    ) {
      setGameWon(true);
    }

    setGuess("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "#22c55e";
      case "partial":
        return "#eab308";
      case "wrong":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const formatProperty = (property: string) => {
    switch (property) {
      case "family":
        return "Família";
      case "physicalState":
        return "Estado Físico";
      case "atomicNumber":
        return "Número Atômico";
      case "discoveryYear":
        return "Ano de Descoberta";
      default:
        return property;
    }
  };

  const formatValue = (property: string, value: string | number) => {
    switch (property) {
      case "family":
        const familyNames: { [key: string]: string } = {
          metal: "Metal",
          "non-metal": "Não-metal",
          "noble-gas": "Gás Nobre",
          halogen: "Halogênio",
        };
        return familyNames[value] || value;
      case "physicalState":
        const stateNames: { [key: string]: string } = {
          solid: "Sólido",
          liquid: "Líquido",
          gas: "Gasoso",
        };
        return stateNames[value] || value;
      case "discoveryYear":
        return typeof value === "number" && value < 0
          ? `${Math.abs(value)} a.C.`
          : value.toString();
      default:
        return value.toString();
    }
  };

  return (
    <Box w="100%" maw="450px" mx="auto">
      <Box
        bg="white"
        p="xl"
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        mb="xl"
      >
        <Text size="24px" fw={700} ta="center" c="#333" mb="md">
          Adivinhe o elemento de hoje
        </Text>
        <Text size="sm" ta="center" c="#666" mb="lg">
          Digite qualquer elemento para começar
        </Text>

        {!gameWon && (
          <Box
            bg="#f0f8ff"
            p="lg"
            style={{
              borderRadius: "8px",
              border: "2px solid #bfdbfe",
            }}
          >
            <Flex gap="md" align="center">
              <Autocomplete
                placeholder="Digite o nome do elemento..."
                value={guess}
                onChange={setGuess}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                data={
                  guess.trim().length > 0
                    ? elements.map((element) => element.name)
                    : []
                }
                limit={5}
                w="280px"
                styles={{
                  input: {
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    color: "#333",
                    "&::placeholder": {
                      color: "#666",
                    },
                    "&:focus": {
                      borderColor: "#4f46e5",
                      boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.2)",
                    },
                  },
                  dropdown: {
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                  },
                  option: {
                    "&[dataSelected]": {
                      backgroundColor: "#4f46e5",
                      color: "white",
                    },
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  },
                }}
              />
              <ActionIcon
                onClick={handleSubmit}
                size="lg"
                variant="filled"
                color="blue"
                style={{
                  borderRadius: "50%",
                  transition: "all 0.2s ease",
                }}
                styles={{
                  root: {
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                    },
                  },
                }}
              >
                <FaArrowRight />
              </ActionIcon>
            </Flex>
          </Box>
        )}
      </Box>

      {gameWon && (
        <Text size="lg" fw={600} ta="center" c="green" mb="xl">
          🎉 Parabéns! Você acertou! O elemento era {targetElement?.name}!
        </Text>
      )}

      <Box>
        {/* Header com nomes das propriedades - apenas se houver tentativas */}
        {guesses.length > 0 && (
          <Flex gap="sm" mb="xs">
            <Flex
              flex={1}
              p="sm"
              pb="xs"
              style={{
                borderBottom: "solid 2px #000",
              }}
              justify={"center"}
              align={"center"}
            >
              <Text size="sm" fw={600} ta="center" c="white">
                Elemento
              </Text>
            </Flex>
            {guesses[0].results.map((result, resultIndex) => (
              <Flex
                key={resultIndex}
                flex={1}
                p="sm"
                pb="xs"
                style={{
                  borderBottom: "solid 2px #000",
                }}
                justify={"center"}
                align={"center"}
              >
                <Text size="sm" fw={600} ta="center" c="white">
                  {formatProperty(result.property)}
                </Text>
              </Flex>
            ))}
          </Flex>
        )}

        {guesses.map((guessItem, index) => (
          <Box key={index} mb="md">
            <Flex gap="sm">
              <Box
                flex={1}
                p="md"
                h="80px"
                style={{
                  backgroundColor: "#374151",
                  borderRadius: "8px",
                  textAlign: "center",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text size="sm" c="white" fw={600}>
                  {guessItem.element.name.toUpperCase()}
                </Text>
                <Text size="xs" c="white" opacity={0.8}>
                  ({guessItem.element.symbol})
                </Text>
              </Box>
              {guessItem.results.map((result, resultIndex) => (
                <Box
                  key={resultIndex}
                  flex={1}
                  p="md"
                  h="80px"
                  style={{
                    backgroundColor: getStatusColor(result.status),
                    borderRadius: "8px",
                    textAlign: "center",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text size="sm" c="white">
                    {formatValue(
                      result.property,
                      result.property === "family"
                        ? guessItem.element.family
                        : result.property === "physicalState"
                        ? guessItem.element.physicalState
                        : result.property === "atomicNumber"
                        ? guessItem.element.atomicNumber
                        : guessItem.element.discoveryYear
                    )}
                  </Text>
                  {result.direction && (
                    <Text size="lg" c="white" mt="xs">
                      {result.direction === "higher" ? "↑" : "↓"}
                    </Text>
                  )}
                </Box>
              ))}
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
