export const getRoomsBasement = () => {
  return [
    { label: "1/1.", value: "terem1/1" },
    { label: "V. terem", value: "teremV" },
    { label: "I. terem", value: "teremI" },
    { label: "2/4 terem", value: "terem2/4" },
    { label: "bejárat3", value: "bejarat3" },
    { label: "bejárat4", value: "bejarat4" },
    { label: "4. terem", value: "terem4" },
    { label: "5. terem", value: "terem5" },
    { label: "7/8 terem", value: "terem7/8" },
    { label: "14/1 terem", value: "terem14/1" },
    { label: "bejárat1", value: "bejarat1" },
    { label: "II. terem", value: "teremII" },
    { label: "58. terem", value: "terem58" },
    { label: "57. terem", value: "terem57" },
    { label: "56. terem", value: "terem56" },
    { label: "55. terem", value: "terem55" },
    { label: "54. terem", value: "terem54" },
    { label: "49. terem", value: "terem49" },
    { label: "III. terem", value: "teremIII" },
    { label: "44. terem", value: "terem44" },
    { label: "bejárat2", value: "bejarat2" },
    { label: "37. terem", value: "terem37" },
    { label: "40. terem", value: "terem40" },
    { label: "porta", value: "porta" },
    { label: "főbejárat", value: "fobejarat" },
    { label: "posta", value: "posta" },
    { label: "ruhatár", value: "ruhatar" },
    { label: "UD shop", value: "ud_shop" },
    { label: "földszinti LIFT", value: "liftf" },
    { label: "Főbejárattal szemben lévő lépcső", value: "kozepsoLepcso" },
  ];
};
export const getRoomsFirstFloor = () => {
  return [
    { label: "111/2. terem", value: "terem111/2" },
    { label: "109. terem", value: "terem109" },
    { label: "106. terem", value: "terem106" },
    { label: "142. terem", value: "terem142" },
    { label: "137. terem", value: "terem137" },
    { label: "135. terem", value: "terem135" },
    { label: "133/1/2. terem", value: "terem133/1/2" },
    { label: "119. terem", value: "terem119" },
    { label: "121. terem", value: "terem121" },
    { label: "123. terem", value: "terem123" },
    { label: "Standok", value: "standok" },
    { label: "Ajándék", value: "ajandek" },
    { label: "Könyvtár", value: "konyvtar" },
    { label: "1. emeleten LIFT", value: "lift1" },
    {
      label: "1. szinten a főbejárattal szemben lévő lépcső ",
      value: "kozepsoLepcso1",
    },
  ];
};

export const getRoomsSecondFloor = () => {
  return [
    { label: "AULA", value: "aula" },
    { label: "Karácsony Sándor terem", value: "teremKaracsonySandor" },
    { label: "mozi", value: "mozi" },
    { label: "205. terem", value: "terem205" },
    { label: "Ólvasóterem", value: "olvaso" },
    { label: "247. terem", value: "terem247" },
    { label: "243. terem", value: "terem243" },
    { label: "X. terem", value: "teremX" },
    { label: "235. terem", value: "terem235" },
    { label: "2. emeleten LIFT", value: "lift2" },
    { label: "DETEP szakkolégiumok", value: "detep" },
  ];
};

export const getRoomsThirdFloor = () => {
  return [
    { label: "Teaház, társasjáték, igazolás, EHÖK", value: "ehok" },
    { label: "316. terem", value: "terem316" },
    { label: "XII. terem", value: "teremXII" },
    { label: "314. terem", value: "terem314" },
    { label: "XI. terem", value: "teremXI" },
    { label: "303. terem", value: "terem303" },
    { label: "346. terem", value: "terem346" },
    { label: "343. terem", value: "terem343" },
    { label: "342. terem", value: "terem342" },
    { label: "340/2. terem", value: "terem340/2" },
    { label: "335. terem", value: "terem335" },
    { label: "3. emeleten LIFT", value: "lift3" },
  ];
};

export const getRoomsFourthFloor = () => {
  return [
    { label: "XV. terem", value: "teremXV" },
    { label: "410. terem", value: "terem410" },
    { label: "XIV. terem", value: "teremXIV" },
    { label: "4. emeleten LIFT", value: "lift4" },
    { label: "422/5. terem", value: "terem422/5" },
    { label: "422/8. terem", value: "terem422/8" },
    { label: "422/1. terem", value: "terem422/1" },
    { label: "425. terem", value: "terem425" },
    { label: "AUD. MAX.", value: "audmax" },
  ];
};

export const getSortedRooms = () => {
  const allRooms = [
    ...getRoomsBasement(),
    ...getRoomsFirstFloor(),
    ...getRoomsSecondFloor(),
    ...getRoomsThirdFloor(),
    ...getRoomsFourthFloor(),
  ];
  return allRooms.sort((a, b) =>
    a.label.localeCompare(b.label, "hu", { numeric: true }),
  );
};
export const getRoomsAll = {
  ...getRoomsBasement,
  ...getRoomsFirstFloor,
  ...getRoomsSecondFloor,
  ...getRoomsThirdFloor,
  ...getRoomsFourthFloor,
};

export const getFloors = () => {
  return [
    { label: "Földszint", value: "foldszint" },
    { label: "1. Emelet", value: "emelet1" },
    { label: "2. Emelet", value: "emelet2" },
    { label: "3. Emelet", value: "emelet3" },
    { label: "4. Emelet", value: "emelet4" },
  ];
};
export const getLift = () => {
  return [
    { label: "Nem", value: "nem" },
    { label: "Igen", value: "igen" },
  ];
};
