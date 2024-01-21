export default [
    '<h1>title</h1>',
    '<h1 bold>title with bold - inferred</h1>',
    '<h1 bold="true">title with bold - true</h1>',
    '<h1 bold="yes">title with bold - yes</h1>',
    '<h1 bold="false">title without bold - false</h1>',
    '<h1 bold="no">title without bold - no</h1>',

    '<h1 underline>title with underline - inferred</h1>',
    '<h1 underline="true">title with underline - true</h1>',
    '<h1 underline="yes">title with underline - yes</h1>',
    '<h1 underline="single">title with single underline</h1>',
    '<h1 underline="double">title with double underline</h1>',
    '<h1 underline="false">title without underline - false</h1>',
    '<h1 underline="no">title without underline - no</h1>',
    '<h1 underline="none">title without underline - none</h1>',

    '<h1 italics>title with italics</h1>',
    '<h1 italics="true">title with italics</h1>',
    '<h1 italics="yes">title with italics</h1>',
    '<h1 italics="false">title without italics</h1>',
    '<h1 italics="no">title without italics</h1>',

    '<h1 fg="red">title with red foreground</h1>',
    '<h1 fg="blue">title with blue foreground</h1>',
    '<h1 fg="green">title with green foreground</h1>',
    '<h1 fg="yellow">title with yellow foreground</h1>',
    '<h1 fg="cyan">title with cyan foreground</h1>',
    '<h1 fg="magenta">title with magenta foreground</h1>',
    '<h1 fg="black">title with black foreground</h1>',
    '<h1 fg="white">title with white foreground</h1>',
    '<h1 fg="gray">title with gray foreground</h1>',    
    '<h1 fg="brightred">title with bright-red foreground</h1>',
    '<h1 fg="brightblue">title with bright-blue foreground</h1>',
    '<h1 fg="brightgreen">title with bright-green foreground</h1>',
    '<h1 fg="brightyellow">title with bright-yellow foreground</h1>',
    '<h1 fg="brightcyan">title with bright-cyan foreground</h1>',
    '<h1 fg="brightmagenta">title with bright-magenta foreground</h1>',

    '<h1 bg="red">title with red background</h1>',
    '<h1 bg="blue">title with blue background</h1>',
    '<h1 bg="green">title with green background</h1>',
    '<h1 bg="yellow">title with yellow background</h1>',
    '<h1 bg="cyan">title with cyan background</h1>',
    '<h1 bg="magenta">title with magenta background</h1>',
    '<h1 bg="black">title with black background</h1>',
    '<h1 bg="white">title with white background</h1>',
    '<h1 bg="gray">title with gray background</h1>',
    '<h1 bg="brightred">title with bright-red background</h1>',
    '<h1 bg="brightblue">title with bright-blue background</h1>',
    '<h1 bg="brightgreen">title with bright-green background</h1>',
    '<h1 bg="brightyellow">title with bright-yellow background</h1>',
    '<h1 bg="brightcyan">title with bright-cyan background</h1>',
    '<h1 bg="brightmagenta">title with bright-magenta background</h1>',

    '<h1 fg="red" bg="blue">title with red foreground and blue background</h1>',
    '<h1 fg="blue" bg="red">title with blue foreground and red background</h1>',

    '<h1 margin="1">title with margin</h1>',
    
    '<h1 margin="1" marginTop="2">title with margin</h1>',
    '<h1 margin="1" marginBottom="2">title with margin</h1>',
    '<h1 margin="1" marginLeft="2">title with margin</h1>',
    '<h1 margin="1" marginRight="2">title with margin</h1>',
    '<h1 margin="1" marginTop="2" marginBottom="3" marginLeft="4" marginRight="5">title with margin</h1>',
    '<h1 margin="1" marginTop="2" marginBottom="3" marginLeft="4" marginRight="5" fg="red">title with margin</h1>',
    '<h1 margin="1" marginTop="2" marginBottom="3" marginLeft="4" marginRight="5" bg="red">title with margin</h1>',
    '<h1 margin="1" marginTop="2" marginBottom="3" marginLeft="4" marginRight="5" fg="red" bg="blue">title with margin</h1>',

    '<h1 margin="1" marginTop="2" marginBottom="3" marginLeft="4" marginRight="5" fg="red" bg="blue" bold>title with margin</h1>',

    '<body><h1>title</h1></body>',
    '<body><h1>title</h1><h2>subtitle</h2><p>Paragraph with <span>span</span> and <div>div</div></p></body>',

    '<h1>Multiple top-level elements</h1><h2>subtitle</h2><p>Paragraph with <span>span</span> and <div>div</div></p>',

    `
        <h1 bold marginBottom="1">My Console App</h1>
        <h2 fg="gray" marginBottom="1">A little something I wrote</h2>
        <p marginBottom="1">
            In order to used this app, do the following:
            <li bullet="*" marginBottom="1"> Create a config file</li>
            <li bullet="*" marginBottom="1"> Run the utility with the -h flag</li>
            <li bullet="*" marginBottom="1"> etc...</li>
        </p>
    `,
    `
        <body>
            <h1 marginBottom="1">
                <span fg="red">title</span>
            </h1>
            <p marginBottom="1">
                <span fg="blue">Paragraph with <span>span</span> and <div>div</div></span>
            </p>
        </body>
    `
];
