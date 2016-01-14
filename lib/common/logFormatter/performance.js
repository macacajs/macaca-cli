/* ================================================================
 * macaca by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Nov 20 2015 17:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright zichen.zzc
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var EOL = require('os').EOL;
var _ = require('../helper');
var Table = require('cli-table');

module.exports = (data, contentType) => {
  try {
    const res = JSON.parse(data);
    const pageTitle = res.title;
    const pageURL = res.path;
    const loadTime = res.loadTime;
    const rules = res.rules;
    
    if (contentType === 'tty') {
      let result;
      const head = `Page Title: ${pageTitle}, Page URL: ${pageURL}`;
      const table = new Table({
        head: ['Name', 'Rule', 'Result', 'Data']
      });
      let groupRules = _.groupBy(rules, rule => rule.type);

      _.mapKeys(groupRules, (val, key) => {
        table.push([key, val[0].rule, val[0].result ? '✔' : '✘', key === 'Load Time' ? `${val[0].value}ms` : val.length])
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
        <table border="1">
          <tr>
            <th>Name</th>
            <th>Rule</th>
            <th>Result</th>
            <th>Data</th>
          </tr>
          
          <% _.mapKeys(groupRules, (val, key) => {
              %><tr><td><%- key %></td><%
              %><td><%- val[0].rule %></td><%
              %><td><%- val[0].result ? '✔' : '✘' %></td><%
              %><td><%- key === 'Load Time' ? val[0].value + 'ms' : val.length %></td></tr><%
          });%>
        </table>
      `;

      if (rules.filter(rule => !rule.result).length > 0) {
        template += `
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
          </table>
        `;
      }
      const compiled = _.template(template);
      return compiled({
        groupRules,
        rules
      });
    }
  } catch(e) {
    console.log(e);
    return data;
  }
}
