/**
 *  CS3212 Software Systems Design Team 20
 */
var cmdDef = (function(cmd) {
  'use strict';

  cmd.cmds = cmds;
  var cmds = {};

  // Default values. 
  cmds = [
    {
      id          : 0,
      name        : "Set X Position",
      parms       : ['x pos'],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id          : 1,
      name        : "Set y Position",
      parms       : ['y pos'],
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
      parms       : ['steps'],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id          : 5,
      name        : "Change Costume",
      parms       : ['image url'],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id          : 6,
      name        : "Change Background",
      parms       : ['image url'],
      def_value   : '0',
      classes     : [],
      isContainer : false,
      extraHtml   : []
    },
    {
      id: 7,
      name        : "Repeat",
      parms       : ['number of reptitions'],
      def_value   : '0',
      classes     : ["command-loop"],
      isContainer : true,
      extraHtml   : ["<ul></ul>"]
    },
  ];

  return cmd;

}(cmdDef || {}));
