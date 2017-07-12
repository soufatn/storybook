const fs = require('fs');
const p = require('path');

function endsWith(str, search) {
  return str.indexOf(search, str.length - search.length) !== -1;
}

module.exports = function({ types: t }) {
  return {
    visitor: {
      ImportDeclaration: {
        exit(path, state) {
          const node = path.node;

          if (endsWith(node.source.value, '.md')) {
            const dir = p.dirname(p.resolve(state.file.opts.filename));
            const absolutePath = p.resolve(dir, node.source.value);
            const markdown = fs.readFileSync(absolutePath, 'utf8');

            path.replaceWith(
              t.variableDeclaration('var', [
                t.variableDeclarator(
                  t.identifier(node.specifiers[0].local.name),
                  t.stringLiteral(markdown)
                ),
              ])
            );
          }
        },
      },
    },
  };
};