import type {SystemId} from './anatomy';

export type Language = 'en' | 'ru';

export const UI = {
  en: {
    interactiveAnatomy: 'INTERACTIVE ANATOMY',
    modeledPieces: 'modeled pieces',
    findStructure: 'Find a structure',
    systems: 'Systems',
    all: 'All',
    skeleton: 'Skeleton',
    organs: 'Organs',
    piecesVisible: 'pieces visible',
    hideAll: 'Hide all',
    searchPlaceholder: 'Heart, femur, cranial nerve…',
    noMatches: 'No structures match your search.',
    searchHint: 'Start with a major organ, or search every named structure.',
    searchRefine: 'Showing up to 80 matches. Refine your search to find smaller structures.',
    piece: 'piece',
    pieces: 'pieces',
    explodeAnatomy: 'Explode anatomy',
    assembled: 'Assembled',
    everyPiece: 'Every piece',
    reset: 'Reset',
    sourceCredits: 'Source & credits',
    preparingAnatomy: 'Preparing the anatomy',
    loading: 'Loading',
    reloadViewer: 'Reload viewer',
    anatomy: 'ANATOMY',
    systemOverview: 'System overview · structure identified from source anatomy',
    atlasReference: 'Atlas reference',
    selectedPieces: 'Selected pieces',
    includedStructures: 'Included structures',
    moreModeledPieces: 'more modeled pieces.',
    modelStats: '2,234 individual meshes and 3,432 named concepts from an adult male reference anatomy.',
    views: {'three-quarter':'three-quarter','front':'front','side':'side','back':'back'},
    viewAnatomicalSource: 'View anatomical source',
    showSurrounding: 'Show surrounding anatomy',
    isolateStructure: 'Isolate structure',
    clearSelection: 'Clear selection',
    sourceScope: 'SOURCE & SCOPE',
    bodyRevealed: 'A body, revealed.',
    exploreReference: 'Explore the adult male reference anatomy from BodyParts3D.',
    dragPan: 'Drag to pan',
    dragOrbit: 'Drag to orbit',
    pinchZoom: 'Pinch to zoom',
    tapInspect: 'Tap to inspect',
    selectedStructure: 'SELECTED STRUCTURE',
    anatomicalInventory: 'ANATOMICAL INVENTORY',
    separatedStructures: 'SEPARATED STRUCTURES',
    adultHumanMale: 'ADULT HUMAN · MALE',
    language: 'RU',
    explorerPanels: 'Explorer panels',
    searchAnatomy: 'Search anatomy',
    aboutAtlas: 'About this atlas',
    anatomicalLayers: 'Anatomical layers',
    closeSystems: 'Close systems',
    findAnatomy: 'Find anatomy',
    closeSearch: 'Close search',
    namedStructures: 'Search named anatomical structures',
    cameraControls: 'Camera controls',
    view: 'View',
    rotateBody: 'Rotate body',
    pauseRotation: 'Pause rotation',
    autoRotate: 'Auto rotate',
    resetView: 'Reset view and layers',
    openLayers: 'Open system layers',
    assembleReset: 'Assemble and reset',
    aboutTitle: 'A body, revealed.',
    aboutDescription: 'Explore the adult male reference anatomy from BodyParts3D.',
    aboutModel: 'Adult male · BodyParts3D',
    aboutModified: 'This modified product is based on Human Atlas by ashemag. The original application code is MIT-licensed; Russian localization and additional changes are maintained in this project.',
    aboutScope: 'This reference does not contain every human structure or variation. Named concepts can contain multiple pieces; each source mesh is rendered once.',
    creditsLicenses: 'Credits & licenses',
    datasetLicense: 'Dataset license',
    originalGeometry: 'Original geometry & metadata',
    sourceProject: 'Human Atlas source project',
    publication: 'Read the BodyParts3D publication',
    desktopDownloads: 'Desktop app',
    downloadMac: 'Download for macOS',
    downloadWindows: 'Download for Windows',
    macDownloadMeta: 'Apple Silicon · DMG',
    windowsDownloadMeta: 'x64 · EXE',
    unsignedBuilds: 'Current desktop builds are unsigned and may show a system warning during installation.',
    releaseDetails: 'Release details',
    downloadShort: 'Download',
    downloadHeading: 'Download the desktop app',
  },
  ru: {
    interactiveAnatomy: 'ИНТЕРАКТИВНАЯ АНАТОМИЯ',
    modeledPieces: '3D-структур',
    findStructure: 'Найти структуру',
    systems: 'Системы',
    all: 'Все',
    skeleton: 'Скелет',
    organs: 'Органы',
    piecesVisible: 'структур отображается',
    hideAll: 'Скрыть все',
    searchPlaceholder: 'Сердце, бедренная кость, черепной нерв…',
    noMatches: 'Ничего не найдено.',
    searchHint: 'Выберите крупный орган или найдите любую анатомическую структуру.',
    searchRefine: 'Показано до 80 совпадений. Уточните запрос для поиска небольших структур.',
    piece: 'структура',
    pieces: 'структур',
    explodeAnatomy: 'Разобрать тело',
    assembled: 'Собрано',
    everyPiece: 'Все структуры',
    reset: 'Сбросить',
    sourceCredits: 'Источник и лицензии',
    preparingAnatomy: 'Подготовка анатомической модели',
    loading: 'Загрузка',
    reloadViewer: 'Перезагрузить',
    anatomy: 'АНАТОМИЯ',
    systemOverview: 'Описание системы · структура определена по исходному анатомическому атласу',
    atlasReference: 'ID в атласе',
    selectedPieces: 'Выбрано структур',
    includedStructures: 'Входящие структуры',
    moreModeledPieces: 'дополнительных структур.',
    modelStats: '2234 отдельных 3D-объекта и 3432 именованных анатомических структуры в модели взрослого мужчины.',
    views: {'three-quarter':'три четверти','front':'спереди','side':'сбоку','back':'сзади'},
    viewAnatomicalSource: 'Открыть источник',
    showSurrounding: 'Показать окружающие структуры',
    isolateStructure: 'Показать отдельно',
    clearSelection: 'Снять выделение',
    sourceScope: 'ИСТОЧНИК И ОБЛАСТЬ ПРИМЕНЕНИЯ',
    bodyRevealed: 'Человеческое тело изнутри.',
    exploreReference: 'Интерактивная анатомическая модель взрослого мужчины на основе BodyParts3D.',
    dragPan: 'Перетаскивание — перемещение',
    dragOrbit: 'Перетаскивание — вращение',
    pinchZoom: 'Жест — масштаб',
    tapInspect: 'Нажатие — выбрать',
    selectedStructure: 'ВЫБРАННАЯ СТРУКТУРА',
    anatomicalInventory: 'АНАТОМИЧЕСКИЕ СТРУКТУРЫ',
    separatedStructures: 'РАЗДЕЛЁННЫЕ СТРУКТУРЫ',
    adultHumanMale: 'ВЗРОСЛЫЙ ЧЕЛОВЕК · МУЖЧИНА',
    language: 'EN',
    explorerPanels: 'Панели атласа',
    searchAnatomy: 'Поиск анатомии',
    aboutAtlas: 'Об атласе',
    anatomicalLayers: 'Анатомические слои',
    closeSystems: 'Закрыть список систем',
    findAnatomy: 'Поиск по анатомии',
    closeSearch: 'Закрыть поиск',
    namedStructures: 'Поиск по названиям анатомических структур',
    cameraControls: 'Управление камерой',
    view: 'Вид',
    rotateBody: 'Вращать модель',
    pauseRotation: 'Остановить вращение',
    autoRotate: 'Автовращение',
    resetView: 'Сбросить вид и слои',
    openLayers: 'Открыть список систем',
    assembleReset: 'Собрать и сбросить',
    aboutTitle: 'Человеческое тело изнутри.',
    aboutDescription: 'Интерактивная модель взрослого мужчины на основе BodyParts3D.',
    aboutModel: 'Взрослый мужчина · BodyParts3D',
    aboutModified: 'Этот модифицированный продукт основан на Human Atlas авторства ashemag. Исходный код приложения распространяется по MIT License; русская локализация и дополнительные изменения поддерживаются в этом проекте.',
    aboutScope: 'Эта референсная модель не содержит все анатомические структуры и варианты. Один concept может включать несколько частей; каждая исходная mesh отображается один раз.',
    creditsLicenses: 'Авторы и лицензии',
    datasetLicense: 'Лицензия набора данных',
    originalGeometry: 'Исходная геометрия и метаданные',
    sourceProject: 'Исходный проект Human Atlas',
    publication: 'Публикация о BodyParts3D',
    desktopDownloads: 'Приложение для компьютера',
    downloadMac: 'Скачать для macOS',
    downloadWindows: 'Скачать для Windows',
    macDownloadMeta: 'Apple Silicon · DMG',
    windowsDownloadMeta: 'x64 · EXE',
    unsignedBuilds: 'Текущие desktop-сборки не подписаны и могут показывать системное предупреждение при установке.',
    releaseDetails: 'Подробнее о релизе',
    downloadShort: 'Скачать',
    downloadHeading: 'Скачать приложение',
  },
} as const;

export const SYSTEM_NAMES: Record<SystemId, {en:string; ru:string}> = {
  skeletal:      {en:'Skeleton',          ru:'Скелет'},
  muscular:      {en:'Muscles',           ru:'Мышцы'},
  cardiac:       {en:'Heart',             ru:'Сердце'},
  sensory:       {en:'Sensory organs',    ru:'Органы чувств'},
  arterial:      {en:'Arteries',          ru:'Артерии'},
  venous:        {en:'Veins',             ru:'Вены'},
  nervous:       {en:'Nervous system',    ru:'Нервная система'},
  respiratory:   {en:'Respiratory',       ru:'Дыхательная система'},
  digestive:     {en:'Digestive',         ru:'Пищеварительная система'},
  urinary:       {en:'Urinary',           ru:'Мочевыделительная система'},
  lymphatic:     {en:'Lymphatic',         ru:'Лимфатическая система'},
  endocrine:     {en:'Endocrine',         ru:'Эндокринная система'},
  reproductive:  {en:'Reproductive',      ru:'Репродуктивная система'},
  integumentary: {en:'Body surface',      ru:'Покровная система'},
  connective:    {en:'Connective tissue', ru:'Соединительная ткань'},
};

export const SYSTEM_DESCRIPTIONS_RU: Record<SystemId,string> = {
  skeletal:
    'Кости образуют опорный каркас тела, защищают органы и служат местом прикрепления мышц. Костная ткань также участвует в хранении минералов и образовании клеток крови.',
  muscular:
    'Скелетные мышцы обеспечивают движение, сокращаясь и воздействуя на места своего прикрепления. Вместе с сухожилиями они двигают суставы, поддерживают позу и участвуют в теплообразовании.',
  cardiac:
    'Сердце — мышечный насос с четырьмя камерами. Клапаны направляют кровь через малый и большой круги кровообращения.',
  sensory:
    'Эти структуры обеспечивают специальные виды чувствительности, включая зрение, слух и равновесие. Специализированные ткани воспринимают раздражители и передают информацию нервной системе.',
  arterial:
    'Сердце обеспечивает движение крови по системе кровообращения. Артерии несут кровь от сердца к тканям, а в малом круге кровообращения — к лёгким.',
  venous:
    'Вены возвращают кровь к сердцу. Поверхностные и глубокие венозные сети собирают кровь из тканей, а лёгочные вены доставляют насыщенную кислородом кровь из лёгких.',
  nervous:
    'Головной и спинной мозг, а также периферические нервы принимают, передают и обрабатывают сигналы. Они обеспечивают чувствительность, движения, координацию и автоматическую регуляцию функций организма.',
  respiratory:
    'Дыхательные пути проводят воздух к лёгким, где происходит обмен кислорода и углекислого газа между воздухом и кровью. Дыхание обеспечивается изменениями давления, создаваемыми дыхательными мышцами.',
  digestive:
    'Пищеварительный тракт расщепляет пищу, всасывает питательные вещества и воду и выводит непереваренные остатки. Вспомогательные органы выделяют желчь и пищеварительные ферменты.',
  urinary:
    'Почки фильтруют кровь и регулируют баланс жидкости, электролитов и кислотно-щелочное состояние. Моча поступает по мочеточникам в мочевой пузырь и выводится через мочеиспускательный канал.',
  lymphatic:
    'Лимфатические сосуды возвращают избыток тканевой жидкости в кровоток. Лимфатические узлы и другие лимфоидные органы участвуют в иммунном надзоре и иммунных реакциях.',
  endocrine:
    'Эндокринные органы выделяют гормоны в кровь и регулируют обмен веществ, рост, реакции на стресс и репродуктивные процессы.',
  reproductive:
    'Представленные структуры мужской репродуктивной системы участвуют в образовании, созревании и транспортировке сперматозоидов, а также в выработке половых гормонов.',
  integumentary:
    'Поверхность тела служит внешним анатомическим ориентиром. Покровная система образует защитный барьер и участвует в чувствительности и терморегуляции.',
  connective:
    'Хрящи, связки и другие соединительные ткани поддерживают, соединяют и разделяют анатомические структуры. Они стабилизируют суставы и распределяют механическую нагрузку.',
};

export const EXPLANATIONS_RU: Record<string,string> = {
  heart:
    'Мышечный орган в грудной клетке. Правая половина сердца направляет кровь в лёгкие, левая — в большой круг кровообращения.',
  liver:
    'Крупный орган под правой частью диафрагмы. Печень перерабатывает всосавшиеся питательные вещества, вырабатывает желчь и синтезирует многие белки крови.',
  brain:
    'Центральный орган нервной системы. Его взаимосвязанные отделы обеспечивают восприятие, движения, память, речь и регуляцию функций организма.',
  stomach:
    'Мышечный полый орган между пищеводом и тонкой кишкой. Желудок накапливает пищу, смешивает её с кислотой и ферментами и постепенно передаёт содержимое в двенадцатиперстную кишку.',
  spleen:
    'Лимфоидный орган в верхней левой части живота. Селезёнка фильтрует кровь, удаляет стареющие клетки крови и участвует в иммунных реакциях.',
  pancreas:
    'Орган брюшной полости, выполняющий пищеварительную и эндокринную функции. Он выделяет пищеварительные ферменты и гормоны, включая инсулин и глюкагон.',
  'urinary bladder':
    'Мышечный резервуар в малом тазу, в котором накапливается моча, поступающая из почек по мочеточникам.',
  trachea:
    'Основной дыхательный путь, соединяющий гортань с бронхами. Хрящевые элементы поддерживают просвет трахеи открытым во время дыхания.',
  diaphragm:
    'Широкая мышца, разделяющая грудную и брюшную полости. При сокращении она увеличивает объём грудной клетки и способствует вдоху.',
};

export function systemName(id:SystemId, language:Language) {
  return SYSTEM_NAMES[id][language];
}

export function systemDescription(
  id:SystemId,
  language:Language,
  englishDescription:string,
) {
  return language === 'ru' ? SYSTEM_DESCRIPTIONS_RU[id] : englishDescription;
}

export function localizedExplanation(
  name:string,
  system:SystemId,
  language:Language,
  englishDescription:string,
) {
  if (language === 'en') return englishDescription;

  return (
    EXPLANATIONS_RU[name.toLowerCase()] ??
    SYSTEM_DESCRIPTIONS_RU[system] ??
    englishDescription
  );
}
