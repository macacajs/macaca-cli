'use strict';

var EOL = require('os').EOL;

var _ = require('../helper');
var Table = require('cli-table');

module.exports = (data, contentType) => {
  try {
    const res = JSON.parse(data);
    const pageTitle = res.title;
    const pageURL = res.path;
    const rules = res.rules;

    if (contentType === 'tty') {
      let result;
      const head = `Page Title: ${pageTitle}, Page URL: ${pageURL}`;
      const table = new Table({
        head: ['Name', 'Rule', 'Result', 'Data']
      });
      let groupRules = _.groupBy(rules, rule => rule.type);

      _.mapKeys(groupRules, (val, key) => {
        let data;
        let result;
        switch(key) {
          case 'Load Time':
            data = `${val[0].value}ms`;
            result = val[0].result ? '✔' : '✘';
            break;
          case 'Invalid Request':
            data = val.length;
            result = '✘';
            break;
          case 'Oversize':
            let count = val.length;
            let successCount = val.filter(item => item.result).length;
            let failCount = count - successCount;
            data = `${successCount}/${count}`;
            result = failCount ? '✘' : '✔';
            break;
          default:
            data = '';
            result = '';
            break;
        }
        table.push([key, val[0].rule, result, data]);
      });
      result = head + EOL + table.toString();
      if (rules.filter(rule => !rule.result).length > 0) {
        const warnings = `Details:`;
        const detailTable = new Table({
          head: ['Item', 'Type', 'Message']
        });
        rules.forEach(rule => {
          if (!rule.result) {
            detailTable.push([rule.item, rule.type, rule.message || rule.value || '']);
          }
        });
        result += EOL + warnings + EOL + detailTable.toString();
      }
      return result;
    } else if (contentType === 'html') {
      let groupRules = _.groupBy(rules, rule => rule.type);
      let template = `
        <caption><%- pageTitle %>: <%- pageURL %></caption>
        <table border="1">
          <tr>
            <th>Name</th>
            <th>Rule</th>
            <th>Result</th>
            <th>Data</th>
          </tr>

          <% _.mapKeys(groupRules, (val, key) => {
              var data;
              var result;
              switch(key) {
                case 'Load Time':
                  data = val[0].value + 'ms';
                  result = val[0].result ? '✔' : '✘';
                  break;
                case 'Invalid Request':
                  data = val.length;
                  result = '✘';
                  break;
                case 'Oversize':
                  var count = val.length;
                  var successCount = val.filter(item => item.result).length;
                  var failCount = count - successCount;
                  data = successCount + '/' + count;
                  result = failCount ? '✘' : '✔';
                  break;
                default:
                  data = '';
                  result = '';
                  break;
              }
              %><tr><td><%- key %></td><%
              %><td><%- val[0].rule %></td><%
              %><td><%- result %></td><%
              %><td><%- data %></td></tr><%
          });%>
        </table>`;

      if (rules.filter(rule => !rule.result).length > 0) {
        template += `<caption>Details:</caption>
          <table border="1">
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Message</th>
            </tr>

            <% _.forEach(rules, (rule) => {
              if (!rule.result) {
                %><tr><td><%- rule.item %></td><%
                %><td><%- rule.type %></td><%
                %><td><%- rule.message || rule.value %></td></tr><%
              }
            });%>
          </table>`;
      }
      const compiled = _.template(template);
      return compiled({
        pageTitle,
        pageURL,
        groupRules,
        rules
      });
    }
  } catch(e) {
    console.log(e);
    return data;
  }
};
