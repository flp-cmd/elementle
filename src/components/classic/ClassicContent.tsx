"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Text,
  ActionIcon,
  Flex,
  Autocomplete,
  OptionsFilter,
} from "@mantine/core";
import { ChemicalElement, GuessResult } from "@/types/element";
import { findElementByName, elements } from "@/data/elements";
import { getDailyElement } from "@/lib/dailyElementService";
import { FaArrowRight } from "react-icons/fa";
import {
  formatProperty,
  formatValue,
  getStatusColor,
} from "@/utils/ClassicUtils";
import { compareElements } from "@/utils/elementUtils";
import { normalizeText } from "@/utils/textUtils";

export default function ClassicContent() {
  const [targetElement, setTargetElement] = useState<ChemicalElement | null>(
    null
  );
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<
    Array<{ element: ChemicalElement; results: GuessResult[] }>
  >([]);
  const [gameWon, setGameWon] = useState(false);

  const loadDailyElement = useCallback(async () => {
    const dailyElement = await getDailyElement();
    if (dailyElement) {
      setTargetElement(dailyElement);
    } else {
      console.error("Failed to load daily element");
    }
  }, []);

  useEffect(() => {
    loadDailyElement();
  }, [loadDailyElement]);

  const handleSubmit = useCallback(() => {
    if (!guess.trim() || !targetElement) return;

    const guessedElement = findElementByName(guess.trim());
    if (!guessedElement) {
      return;
    }

    const alreadyGuessed = guesses.some(
      (guess) => guess.element.name === guessedElement.name
    );
    if (alreadyGuessed) {
      setGuess("");
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
  }, [guess, targetElement, guesses]);

  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const normalizedSearch = normalizeText(search);
    return options.filter((option) => {
      if ("label" in option) {
        const normalizedOption = normalizeText(option.label);
        return normalizedOption.includes(normalizedSearch);
      }
      return false;
    });
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
                    ? elements
                        .filter(
                          (element) =>
                            !guesses.some(
                              (guess) => guess.element.name === element.name
                            )
                        )
                        .map((element) => element.name)
                    : []
                }
                filter={optionsFilter}
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
                      result.property === "group_name"
                        ? guessItem.element.group_name
                        : result.property === "state_ntp"
                        ? guessItem.element.state_ntp
                        : result.property === "atomic_number"
                        ? guessItem.element.atomic_number
                        : guessItem.element.discovery_year
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
