import React from "react";

import DynamicTexts from "../molecules/DynamicTexts";

import Image from "../atoms/Image";



function CardsDisplay({ content = [], className = "p-4", isCardList = false }) {

  return (

    <div className={className}>

      <div

        className={

          isCardList

            ? "flex flex-col gap-6 max-w-6xl mx-auto"

            : "grid grid-cols-1 md:grid-cols-3 gap-4"

        }

      >

        {content.map((item, index) => (

          <div

            key={index}

            className={

              isCardList

                ? "flex flex-col sm:flex-row items-start border p-4 rounded-lg shadow-md"

                : "border p-4 rounded-lg shadow-md"

            }

          >

            {item.card.map((element, idx) => {

              if (element.type === "image") {

                return (

                  <img

                    key={idx}

                    src={element.src}

                    alt={element.alt}

                    className={

                      isCardList

                        ? "w-24 h-24 object-contain sm:mr-4 mb-4 sm:mb-0"

                        : element.className

                    }

                  />

                );

              }

              if (element.type === "text") {

                return (

                  <DynamicTexts

                    key={idx}

                    Texts={[element]}

                    className={isCardList ? "flex-1" : ""}

                  />

                );

              }

              return null;

            })}

          </div>

        ))}

      </div>

    </div>

  );
