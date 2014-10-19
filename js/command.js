/**
 *  CS3212 Software Systems Design Team 20
 */
var cmdDef = (function(cmd) {
  'use strict';

  var cmds = {};

  // Default values. 
  cmds = [
    {
      id          : 0,
      name        : "Set Horizontal Position",
      parms       : ['Horizontal Position'],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id          : 1,
      name        : "Set Vertical Position",
      parms       : ['Vertical Position'],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id          : 2,
      name        : "Show Character",
      parms       : [],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id          : 3,
      name        : "Hide Character",
      parms       : [],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id          : 4,
      name        : "Move",
      parms       : ['Steps'],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id          : 5,
      name        : "Change Costume",
      parms       : ['Image URL'],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id          : 6,
      name        : "Change Background",
      parms       : ['Image URL'],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id: 7,
      name        : "Repeat",
      parms       : ['Number of reptitions'],
      def_value   : '0',
      classes     : ["command-loop"],
      isContainer : true,
      extraHtml   : ["<ul></ul>"]
    },
  ];

  cmd.cmds = cmds;
  
  return cmd;

}(cmdDef || {}));
