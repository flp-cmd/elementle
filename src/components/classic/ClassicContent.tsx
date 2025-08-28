"use client";

import { useState, useCallback, useMemo } from "react";
import { Box, Text, ActionIcon, Flex, Autocomplete } from "@mantine/core";
import { ChemicalElement, DailyElementResponse } from "@/types/element";
import { findElementByName, elements, getElementById } from "@/data/elements";
import { createOptionsFilter } from "@/utils/textUtils";
import { FaArrowRight } from "react-icons/fa";
import {
  formatProperty,
  formatValue,
  getStatusColor,
} from "@/utils/ClassicUtils";
import { compareElements } from "@/utils/elementUtils";
import { useQuery } from "@tanstack/react-query";
import { useGuessesStorage } from "@/hooks/useGuessesStorage";

export default function ClassicContent() {
  const [guess, setGuess] = useState("");
  const { guesses, setGuesses, gameWon, setGameWon } =
    useGuessesStorage();

  // Get today's date as string (YYYY-MM-DD format)
  const today = new Date().toISOString().split("T")[0];

  const { data: targetElement } = useQuery({
    queryKey: ["daily-element", today],
    queryFn: async (): Promise<ChemicalElement | undefined> => {
      const response = await fetch("/api/daily-element", {
        method: "GET",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_DAILY_ELEMENT_API_KEY || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: DailyElementResponse = await response.json();
      return getElementById(responseData.data.elementId);
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
  });

  const handleSubmit = useCallback(
    (value?: string) => {
      const searchValue = value || guess;

      if (!searchValue.trim() || !targetElement) return;

      const guessedElement = findElementByName(searchValue.trim());
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
    },
    [guess, targetElement, guesses, setGuesses, setGameWon]
  );

  const optionsFilter = useMemo(() => createOptionsFilter(), []);

  return (
    <Box w="100%" maw={{ base: "100%", sm: "450px" }} mx="auto">
      <Box p={0}>
        <Text
          fw={700}
          ta="center"
          c="#fff"
          mb="md"
          style={{ fontSize: "clamp(18px, 4vw, 24px)" }}
        >
          Adivinhe o elemento de hoje
        </Text>
        <Text
          ta="center"
          c="#fff"
          mb="lg"
          style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}
        >
          Digite qualquer elemento para começar
        </Text>

        {!gameWon && (
          <Box
            bg="#dee1e4"
            p={{ base: "md" }}
            style={{
              borderRadius: "8px",
              border: "2px solid #0c2a4e",
            }}
          >
            <Flex gap={{ base: "sm", md: "lg" }} align="center" direction="row">
              <Autocomplete
                placeholder="Digite o nome do elemento..."
                value={guess}
                onChange={setGuess}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                onOptionSubmit={(value: string) => {
                  handleSubmit(value);
                }}
                clearable
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
                w={"100%"}
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
                onClick={() => handleSubmit()}
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
        <Text
          fw={600}
          ta="center"
          c="green"
          mb={{ base: "md", sm: "lg", md: "xl" }}
          style={{ fontSize: "clamp(16px, 3vw, 20px)" }}
        >
          🎉 Parabéns! Você acertou! O elemento era {targetElement?.name}!
        </Text>
      )}

      <Box>
        {/* Header com nomes das propriedades - apenas se houver tentativas */}
        {guesses.length > 0 && (
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(5, 1fr)`,
              gap: "3px",
              marginBottom: "8px",
            }}
          >
            <Flex
              style={{
                borderBottom: "solid 2px #000",
              }}
              p={{ base: "xs", sm: "sm" }}
              pb="xs"
              justify={"center"}
              align={"center"}
            >
              <Text
                fw={600}
                ta="center"
                c="white"
                style={{ fontSize: "clamp(10px, 2vw, 14px)" }}
              >
                Elemento
              </Text>
            </Flex>
            {guesses[0].results.map((result, resultIndex) => (
              <Flex
                key={resultIndex}
                style={{
                  borderBottom: "solid 2px #000",
                }}
                p={{ base: "xs", sm: "sm" }}
                pb="xs"
                justify={"center"}
                align={"center"}
              >
                <Text
                  fw={600}
                  ta="center"
                  c="white"
                  style={{ fontSize: "clamp(10px, 2vw, 14px)" }}
                >
                  {formatProperty(result.property)}
                </Text>
              </Flex>
            ))}
          </Box>
        )}

        {[...guesses].reverse().map((guessItem, index) => (
          <Box key={index} mb={{ base: "sm", sm: "md" }}>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(5, 1fr)`,
                gap: "3px",
              }}
            >
              <Flex
                p={{ base: "xs", sm: "sm", md: "md" }}
                h={{ base: "60px", sm: "70px", md: "80px" }}
                ta={"center"}
                pos={"relative"}
                direction={"column"}
                justify={"center"}
                align={"center"}
                bg={"#374151"}
                bd={"1px solid #ffffffb5"}
              >
                <Text
                  c="white"
                  fw={600}
                  style={{ fontSize: "clamp(10px, 2vw, 14px)" }}
                >
                  {guessItem.element.name.toUpperCase()}
                </Text>
                <Text
                  c="white"
                  opacity={0.8}
                  style={{ fontSize: "clamp(8px, 1.5vw, 12px)" }}
                >
                  ({guessItem.element.symbol})
                </Text>
              </Flex>
              {guessItem.results.map((result, resultIndex) => (
                <Flex
                  key={resultIndex}
                  p={{ base: "xs", sm: "sm", md: "md" }}
                  h={{ base: "60px", sm: "70px", md: "80px" }}
                  bg={getStatusColor(result.status)}
                  ta={"center"}
                  pos={"relative"}
                  direction={"column"}
                  justify={"center"}
                  align={"center"}
                  bd={"1px solid #ffffffb5"}
                >
                  <Text
                    c="white"
                    style={{ fontSize: "clamp(10px, 2vw, 14px)" }}
                  >
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
                    <Text
                      c="white"
                      mt="xs"
                      style={{ fontSize: "clamp(16px, 3vw, 24px)" }}
                    >
                      {result.direction === "higher" ? "↑" : "↓"}
                    </Text>
                  )}
                </Flex>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
